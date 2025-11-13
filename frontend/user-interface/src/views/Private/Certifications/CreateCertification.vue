<script setup lang="ts">
import DropdownInput from '@/components/common/DropdownInput/DropdownInput.vue';
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';
import FormInput from '@/components/common/FormInput/FormInput.vue';
import { useCreateCertificate } from '@/views/Private/Certifications/composables/useCreateCertificate';
import FormButton from '@/components/common/FormButton/FormButton.vue';
import { computed, ref, watch, watchEffect } from 'vue';
import FormCheckboxInput from '@/components/common/FormCheckboxInput/FormCheckboxInput.vue';
import FormTextAreaInput from '@/components/common/FormTextAreaInput/FormTextAreaInput.vue';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse, CommonResponse } from '@/Types';
import { fetchSingleUserProfile } from '@/Utils/userServices';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import type { CreateCertificateRequestPayload } from '@/Types/certificate-related-types';
import router from '@/router';
import { submitCertificationRequest } from '@/Utils/certificateServices';

const props = defineProps<{
  role: string,
  id: string
}>();

const {
  form,
  errors,
  errorMessages,
  certificateOptions,
  validateCertificateForm,
  setServerErrors
} = useCreateCertificate();

const requestorName = ref<string>('')
const requestorAddress = ref<string>('')
const requestorBirthDate = ref<string>('')


const hasError = ref<boolean>(false)
const navigation = useGlobalLoadingStore();

const handleCreateCertificateRequest = async () => {
  navigation.startNavigation();
  try {
    const isValid = validateCertificateForm();

    if (isValid) {
      // HNDLE FORM REQUEST HERE
      const requestPayload: CreateCertificateRequestPayload = {
        cert_request_type: form.certificateRequestType,
        start_residency_date: form.startResidencyDate,
        end_residency_date: form.isCurrent ? '' : form.endResidencyDate,
        cert_request_reason: form.certificateRequestReason,
      }

      const response = await submitCertificationRequest(requestPayload, props.id);

      if (response.status !== 'success') {
        throw response;
      }

      // Update to redirect to new success page.
      router.push({ name: 'Certifications', params: { role: props.role } })

      hasError.value = false
    } else {
      hasError.value = true
    }

  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    if (axiosError?.isAxiosError) {
      const responseData = axiosError.response?.data;
      setServerErrors(responseData?.errors, responseData?.message);
    } else if (fallbackResponse?.message) {
      setServerErrors(undefined, fallbackResponse.message);
    } else {
      setServerErrors(undefined, 'Failed to create a certificate request.');
    }

    hasError.value = true;

  } finally {
    navigation.endNavigation();
  }
}

const fetchUserProfile = async () => {
  navigation.startNavigation()

  try {
    hasError.value = false

    const response = await fetchSingleUserProfile(props.id)
    const responseData = response.data;

    requestorName.value = `${responseData.profile.first_name ?? ''} ${responseData.profile.middle_name ?? ''} ${responseData.profile.last_name ?? ''} `
    requestorAddress.value = responseData.profile.street_address
    requestorBirthDate.value = responseData.profile.date_of_birth

  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    const apiErrorResponse = axiosError.response?.data?.errors

    setServerErrors(apiErrorResponse, fallbackResponse.message);
    hasError.value = true
  } finally {
    navigation.endNavigation();
  }
}

const today = computed(() => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

watch(() => form.isCurrent, (isCurrent) => {
  if (isCurrent) {
    // set the endResidencyDate field if Present checkbox is checked
    form.endResidencyDate = `${today.value}`
  } else {
    // Optionally clear the field when unchecked
    form.endResidencyDate = ''
  }
})

const filteredErrors = computed(() => {
  return Object.values(errorMessages.value).filter(msg => msg.error && msg.error.trim() !== '');
});

watch(() => form.certificateRequestType, (oldVal, newVal) => {
  if (oldVal !== newVal) {
    errors.value.certificateRequestType = false;
  }
})

watch(() => form.certificateRequestReason, (newVal) => {
  if (newVal) {
    errors.value.certificateRequestReason = false;
  }
})

watchEffect(() => {
  fetchUserProfile();
})

// FETCH USER BY USER_ID
</script>
<template>
  <div class="my-5">
    <FormContainer title="Certification Request Form" max-width="750px">
      <WarningLabel :has-error="hasError && filteredErrors.length > 0" :errors="filteredErrors" />
      <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleCreateCertificateRequest">
        <div class="col-12 ">
          <DropdownInput :options="certificateOptions" label="Certificate Request Type" id="select-certificate-request"
            v-model="form.certificateRequestType" :error-message="errorMessages.certificateRequestType.error"
            :has-error="errors.certificateRequestType" />
        </div>
        <div class="col-12">
          <FormInput type="text" label="Complete Name" id="complete-name" v-model="requestorName" :is-disabled="true" />
        </div>
        <div class="col-12">
          <FormInput type="text" label="Address" id="address" v-model="requestorAddress" :is-disabled="true" />
        </div>
        <div class="row gx-2 gy-2">
          <div class="col-12 col-md-5 ">
            <FormInput type="date" label="Start Residency Date" :optional="true" id="start-residency-date"
              v-model="form.startResidencyDate" :max="today" />
          </div>
          <div class="col-12 col-md-7 ">
            <div class="row align-items-center">
              <div class="col-12 col-md-8">
                <FormInput type="date" label="End Residency Date" :optional="true" id="end-residency-date"
                  v-model="form.endResidencyDate" :is-disabled="form.isCurrent" :max="today" />
              </div>
              <div class="col-4 ms-auto">
                <FormCheckboxInput id="check-resident-present" label="Present" v-model="form.isCurrent" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <FormTextAreaInput label="Purpose of Certificate" id="certificate-request-purpose"
            v-model="form.certificateRequestReason" :error-message="errorMessages.certificateRequestReason.error"
            :has-error="errors.certificateRequestReason" :is-resizeable="false" />
        </div>
        <div class="col-md-6 col-sm-12 mx-auto">
          <FormButton label="Submit" />
        </div>
      </form>
    </FormContainer>
  </div>
</template>
