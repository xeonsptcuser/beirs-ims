<script setup lang="ts">
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';
import { useCreateCertificate } from '@/views/Private/Certifications/composables/useCreateCertificate';
import FormButton from '@/components/common/FormButton/FormButton.vue';
import { computed, ref, watch, watchEffect } from 'vue';
import FormCheckboxInput from '@/components/common/FormCheckboxInput/FormCheckboxInput.vue';
import FormTextAreaInput from '@/components/common/FormTextAreaInput/FormTextAreaInput.vue';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse, CommonResponse, CreateCertificateRequestPayload } from '@/Types';
import { fetchSingleUserProfile } from '@/Utils/userServices';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import router from '@/router';
import { submitCertificationRequest } from '@/Utils/certificateServices';
import FormFloatingInput from '@/components/common/FormFloatingInput/FormFloatingInput.vue';
import { dateToday, maxDate, orderedOptions } from '@/Utils/helpers/formatters';

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
const showConfirmationModal = ref<boolean>(false)

const hasError = ref<boolean>(false)
const navigation = useGlobalLoadingStore();

const handleCreateCertificateRequest = async () => {
  navigation.startNavigation();
  try {
    const isValid = validateCertificateForm();
    hasError.value = false

    if (isValid) {
      // HNDLE FORM REQUEST HERE
      const requestPayload: CreateCertificateRequestPayload = {
        cert_request_type: form.certificateRequestType,
        start_residency_date: form.startResidencyDate,
        end_residency_date: form.isCurrent ? '' : form.endResidencyDate,
        cert_request_reason: form.certificateRequestReason,
        is_current: form.isCurrent
      }

      const response = await submitCertificationRequest(requestPayload, props.id);

      if (response.status !== 'success') {
        throw response;
      }

      // Update to redirect to new success page.
      await router.replace({ name: 'SuccessCertTransaction', params: { role: props.role } })
      globalThis.location.reload();
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

const handleFormSubmit = () => {
  hasError.value = !validateCertificateForm();
  if (hasError.value) return;

  showConfirmationModal.value = true;
}

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
}

watch(() => form.isCurrent, (isCurrent) => {
  if (isCurrent) {
    // set the endResidencyDate field if Present checkbox is checked
    form.endResidencyDate = dateToday();
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
      <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleFormSubmit">
        <div class="col-12">
          <p class="text-muted mb-2 small">Certificate Request Type</p>
          <div class="d-flex flex-wrap gap-2">
            <button v-for="option in orderedOptions(certificateOptions)" :key="option" type="button"
              class="btn option-pill" :class="{
                'btn-primary text-white border-0': form.certificateRequestType === option,
                'btn-outline-secondary': form.certificateRequestType !== option
              }" @click="form.certificateRequestType = option">
              {{ option.charAt(0).toUpperCase() + option.slice(1) }}
            </button>
          </div>
          <small v-if="errors.certificateRequestType" class="text-danger">
            {{ errorMessages.certificateRequestType.error }}
          </small>
        </div>
        <div class="col-12">
          <FormFloatingInput type="text" label="Complete Name" id="complete-name" v-model="requestorName"
            :is-disabled="true" />
        </div>
        <div class="col-12">
          <FormFloatingInput type="text" label="Address" id="address" v-model="requestorAddress" :is-disabled="true" />
        </div>
        <div class="row gx-2 gy-2" v-if="form.certificateRequestType === 'residency'">
          <div class="col-12 col-md-5 ">
            <FormFloatingInput type="date" label="Start Residency Date" :optional="true" id="start-residency-date"
              v-model="form.startResidencyDate" :max="maxDate()" :is-capitalized="false" />
          </div>
          <div class="col-12 col-md-7 ">
            <div class="row align-items-center">
              <div class="col-12 col-md-8">
                <FormFloatingInput type="date" label="End Residency Date" :optional="true" id="end-residency-date"
                  v-model="form.endResidencyDate" :is-disabled="form.isCurrent" :max="maxDate()"
                  :is-capitalized="false" />
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
            :has-error="errors.certificateRequestReason" :is-resizeable="false" maxLength="200" />
        </div>
        <div class="col-md-6 col-sm-12 mx-auto">
          <FormButton label="Submit" />
        </div>

        <dialog v-if="showConfirmationModal" class="modal fade show d-block" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" style="font-size: 16px;">Request Barangay Certificate?</h5>
                <button type="button" class="btn-close" aria-label="Close" @click="closeConfirmationModal"></button>
              </div>
              <div class="modal-body">
                <p class="text-secondary mb-3">
                  **Double-check all information** (personal details, purpose, and required documents) before submitting
                  your request for a Barangay Certificate.
                </p>
                <ul class=" text-secondary small ps-3 mb-0  ">
                  <li class="mb-3">Confirm your **complete and correct personal information** (Name, Address, etc.).
                  </li>
                  <li class="mb-3">Ensure the **purpose of your request** is clearly and accurately stated (e.g., for
                    employment,
                    school, financial assistance).</li>
                  <li class="mb-3">**For Certificate of Residency:** Ensure your length of stay in the Barangay is
                    accurately
                    reflected.</li>
                </ul>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" @click="closeConfirmationModal">Review
                  Again</button>
                <button type="button" class="btn btn-primary" @click="handleCreateCertificateRequest">Submit
                  Request</button>
              </div>
            </div>
          </div>
        </dialog>

      </form>

    </FormContainer>
  </div>
</template>

<style scoped>
.option-pill {
  padding: 0.65rem 1.2rem;
  border-radius: 999px;
  font-weight: 600;
  text-transform: capitalize;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.option-pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.08);
}

.modal-backdrop {
  z-index: 1040 !important;
}

.modal.show.d-block {
  z-index: 1050 !important;
  background: rgba(0, 0, 0, 0.25);
}
</style>
