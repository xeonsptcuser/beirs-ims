<script setup lang="ts">
import FormButton from '@/components/common/FormButton/FormButton.vue';
import InfoField from './components/InfoField.vue';
import InfoFieldTextArea from './components/InfoFieldTextArea.vue';
import { computed, onMounted, ref } from 'vue';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { fetchCertificateInfo, updateCertificateRequest } from '@/Utils/certificateServices';
import { computeAge, formatDateToHuman, formatName } from '@/Utils/helpers/formatters';
import { evaluateStatus, navigateToTopPage } from '@/Utils/helpers/common-helpers';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import SuccessLabel from '@/components/common/SuccessLabel/SuccessLabel.vue';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse, CertificateRequestsResponse, CommonResponse, StatusOptions, UpdateCertificateRequestPayload } from '@/Types';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';

const props = defineProps<{
  role: string,
  id: string
}>()

const navigation = useGlobalLoadingStore();

const certificateInfo = ref<CertificateRequestsResponse | null>()
const useSession = useSessionStore();

const hasApproval = ref<boolean>(false);
const hasRejection = ref<boolean>(false);
const hasReleasing = ref<boolean>(false);
const hasDone = ref<boolean>(false);

const successMessage = ref<string>('');

const hasError = ref<boolean>(false);
const errorMessage = ref<string>('');

const fetchCertificateRequestInfo = async () => {
  navigation.startNavigation()
  try {
    const response = await fetchCertificateInfo(props.id);
    certificateInfo.value = response.data;
    console.log(certificateInfo.value)

  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    if (axiosError?.isAxiosError) {
      const responseData = axiosError.response?.data;
      errorMessage.value = responseData?.message ?? '';
    } else if (fallbackResponse?.message) {
      errorMessage.value = fallbackResponse.message ?? '';
    } else {
      errorMessage.value = 'Failed to fetch certificate requests.';
    }

    hasError.value = true;
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

    if (response.status !== 'success') {
      throw response;
    }

    certificateInfo.value = response.data;

    if (status === 'approved') {
      hasApproval.value = true;
      successMessage.value = 'Certificate request has been approved!'
    }

    if (status === 'rejected') {
      hasRejection.value = true;
      successMessage.value = 'Certificate request has been rejected!'
    }

    if (status === 'released') {
      hasApproval.value = false
      hasReleasing.value = true;
      successMessage.value = 'Certificate request is ready for releasing!'
    }

    if (status === 'done') {
      hasApproval.value = false
      hasReleasing.value = false;
      hasDone.value = true;
      successMessage.value = 'Certificate request has been released!'
    }

  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    if (axiosError?.isAxiosError) {
      const responseData = axiosError.response?.data;
      errorMessage.value = responseData?.message ?? '';
    } else if (fallbackResponse?.message) {
      errorMessage.value = fallbackResponse.message ?? '';
    } else {
      errorMessage.value = 'Failed to fetch certificate requests.';
    }

    hasError.value = true;
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

const isReleased = computed(() => {
  return certificateInfo.value?.status === 'released'
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
  return isApproved.value && (useSession.isRoleStaff() || useSession.isRoleAdmin());
});

const showDoneButton = computed(() => {
  return isReleased.value && (useSession.isRoleStaff() || useSession.isRoleAdmin());
});

onMounted(() => {
  fetchCertificateRequestInfo();
})

</script>
<template>
  <SuccessLabel v-if="hasApproval" :is-success="hasApproval" :message="successMessage" alert-type="primary" />
  <SuccessLabel v-if="hasRejection" :is-success="hasRejection" :message="successMessage" alert-type="warning" />
  <SuccessLabel v-if="hasReleasing" :is-success="hasReleasing" :message="successMessage" alert-type="info" />
  <SuccessLabel v-if="hasDone" :is-success="hasDone" :message="successMessage" alert-type="success" />
  <WarningLabel :has-error="hasError" :errors="[{ error: errorMessage }]" />

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
            <InfoField label="Age"
              :data-value="`${computeAge(certificateInfo?.profile.date_of_birth ?? '-')} years old`" />
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
          <div class="row border-bottom border-top py-2">
            <InfoField label="Assigned To" :data-value="certificateInfo?.handler
              ? formatName(
                certificateInfo?.handler.first_name ?? '',
                certificateInfo?.handler.middle_name ?? '',
                certificateInfo?.handler.last_name ?? ''
              )
              : '-'" />
            <InfoField label="Position"
              :data-value="certificateInfo?.handler ? certificateInfo?.handler.user?.role : '-'" />
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
              @Click="() => handleApproveRejectReleaseCertRequest('cancelled')" />
          </div>
          <div class="col-md-4 col-sm-12 mx-auto" v-if="showReleaseButton">
            <FormButton type="button" label="Releasing" btn-display="info"
              @Click="() => handleApproveRejectReleaseCertRequest('released')" />
          </div>
          <div class="col-md-4 col-sm-12 mx-auto" v-if="showDoneButton">
            <FormButton type="button" label="Done" btn-display="success"
              @Click="() => handleApproveRejectReleaseCertRequest('done')" />
          </div>
          <div class="d-flex justify-content-evenly align-items-center mx-auto" v-if="showApproveRejectBtn">
            <div class="col-md-4 col-12">
              <FormButton type="button" label="Approve" btn-display="primary"
                @Click="() => handleApproveRejectReleaseCertRequest('approved')" />
            </div>
            <div class="col-md-4 col-12">
              <FormButton type="button" label="Reject" btn-display="danger"
                @Click="() => handleApproveRejectReleaseCertRequest('rejected')" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
