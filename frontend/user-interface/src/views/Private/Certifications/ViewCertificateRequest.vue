<script setup lang="ts">
import FormButton from '@/components/common/FormButton/FormButton.vue';
import InfoField from './components/InfoField.vue';
import InfoFieldTextArea from './components/InfoFieldTextArea.vue';
import { computed, onMounted, ref } from 'vue';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { fetchCertificateInfo, updateCertificateRequest } from '@/Utils/certificateServices';
import type { CertificateRequestsResponse, StatusOptions, UpdateCertificateRequestPayload } from '@/Types/certificate-related-types';
import { computeAge, formatDateToHuman, formatName } from '@/Utils/helpers/formatters';
import { evaluateStatus, navigateToTopPage } from '@/Utils/helpers/common-helpers';
import { useSessionStore } from '@/Utils/store/useSessionStore';

const props = defineProps<{
  role: string,
  id: string
}>()

const navigation = useGlobalLoadingStore();

const certificateInfo = ref<CertificateRequestsResponse | null>()
const useSession = useSessionStore();

const fetchCertificateRequestInfo = async () => {
  navigation.startNavigation()
  try {
    const response = await fetchCertificateInfo(props.id);
    certificateInfo.value = response.data;

  } catch (error) {
    console.log(error)
  } finally {
    navigation.endNavigation()
  }
}

const handleApproveRejectReleaseCertRequest = async (status: StatusOptions) => {
  if (status === 'cancelled') {
    const userConfirmed = globalThis.confirm('Are you sure you want to cancel request?');
    if (!userConfirmed) return;
  }

  navigation.startNavigation();
  try {
    // HANDLE CANCEL, APPROVE & REJECT FUNCTIONALITY HERE
    const requestPayload: UpdateCertificateRequestPayload = { status };

    const response = await updateCertificateRequest(certificateInfo.value?.id.toString() ?? '', requestPayload)

    certificateInfo.value = response.data;

    // redirect to success page
    console.log('REDIRECT TO SUCCESS PAGE')
  } catch (error) {
    console.log(error)
  } finally {
    navigation.endNavigation();
  }
}

const showIfCertificateRequestOwner = computed(() => {
  return certificateInfo.value?.profile.id === useSession.id
})

const isApproved = computed(() => {
  return certificateInfo.value?.status === 'approved'
})

const isPending = computed(() => {
  return certificateInfo.value?.status === 'pending'
})

const showApproveRejectBtn = computed(() => {
  return isPending.value && !showIfCertificateRequestOwner.value && !useSession.isRoleResident()
})

const showCancelButton = computed(() => {
  return showIfCertificateRequestOwner.value && isPending.value
})

const showReleaseButton = computed(() => {
  return isApproved && useSession.isRoleStaff();
});

onMounted(() => {
  fetchCertificateRequestInfo();
})

</script>
<template>
  <div class="my-5">
    <div class="p-2 p-md-4 rounded border border-gray-500 bg-white">
      <div class="col-10 mx-auto">
        <div>
          <a href="#" @click="navigateToTopPage"><i class="bi bi-arrow-left me-2"></i>PREVIOUS PAGE</a>
        </div>
        <div class="my-3">
          <h3 class="text-center">Certificate Request Information</h3>
        </div>
        <div class="rounded border border-gray-500 px-2 py-4">
          <div class="row">
            <InfoField label="Certificate Type" :data-value="certificateInfo?.cert_request_type ?? '-'" />
            <InfoField label="Request Status" :data-value="certificateInfo?.status ?? '-'"
              :styles="evaluateStatus(certificateInfo?.status ?? '')" />
          </div>
          <div class="row">
            <InfoField label="Complete Name"
              :data-value="formatName(certificateInfo?.profile.first_name, certificateInfo?.profile.middle_name, certificateInfo?.profile.last_name)" />
            <InfoField label="Age" :data-value="computeAge(certificateInfo?.profile.date_of_birth ?? '-')" />
          </div>
          <div class="row">
            <InfoField label="Street Address" :data-value="certificateInfo?.profile.street_address ?? '-'" />
            <InfoField label="Mobile Number" :data-value="certificateInfo?.profile.mobile_number ?? ''" />
          </div>
          <div class="row">
            <InfoField label="Start Residency"
              :data-value="formatDateToHuman(certificateInfo?.start_residency_date ?? '') ?? '-'" />
            <InfoField label="End Residency"
              :data-value="certificateInfo?.is_current ? 'Current' : formatDateToHuman(certificateInfo?.end_residency_date ?? '') ?? '-'" />
          </div>
          <div class="mb-1">
            <InfoFieldTextArea label="Purpose" :data-value="certificateInfo?.cert_request_reason ?? '-'" />
          </div>
          <div class="row">
            <InfoField label="Date Submitted"
              :data-value="formatDateToHuman(certificateInfo?.created_at ?? '') ?? '-'" />
            <InfoField label="Date Modified"
              :data-value="formatDateToHuman(certificateInfo?.updated_at ?? '') ?? '-'" />
          </div>
        </div>
        <div class="mb-5 mt-3">
          <div class="col-md-4 col-sm-12 mx-auto" v-if="showCancelButton">
            <FormButton type="button" label="Cancel" btn-display="danger"
              @Click.prevent="() => handleApproveRejectReleaseCertRequest('cancelled')" />
          </div>
          <div class="col-md-4 col-sm-12 mx-auto" v-if="showReleaseButton">
            <FormButton type="button" label="Releasing" btn-display="success"
              @Click.prevent="() => handleApproveRejectReleaseCertRequest('released')" />
          </div>
          <div class="d-flex justify-content-evenly align-items-center mx-auto" v-if="showApproveRejectBtn">
            <div class="col-md-4 col-12">
              <FormButton type="button" label="Approve" btn-display="primary"
                @Click.prevent="() => handleApproveRejectReleaseCertRequest('approved')" />
            </div>
            <div class="col-md-4 col-12">
              <FormButton type="button" label="Reject" btn-display="danger"
                @Click.prevent="() => handleApproveRejectReleaseCertRequest('rejected')" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
