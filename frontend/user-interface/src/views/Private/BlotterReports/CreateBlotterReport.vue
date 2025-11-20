<script setup lang="ts">
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import { computed, ref, watch } from 'vue';
import { useBlotterReports } from './composable/useBlotterReport';
import FormFloatingInput from '@/components/common/FormFloatingInput/FormFloatingInput.vue';
import DropdownInput from '@/components/common/DropdownInput/DropdownInput.vue';
import { useCreateUserAccount } from '../Residents/composable/useCreateUserAccount';
import FormButton from '@/components/common/FormButton/FormButton.vue';
import FormTextAreaInput from '@/components/common/FormTextAreaInput/FormTextAreaInput.vue';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import type { ApiErrorResponse, BlotterReportRequestPayload, CommonResponse, UserProfile as UserProfileType } from '@/Types';
import UploadFiles from './components/UploadFiles.vue';
import { maxDate, orderedOptions } from '@/Utils/helpers/formatters';
import { submitBlotterReport } from '@/Utils/blotterReportServices';
import type { AxiosError } from 'axios';
import router from '@/router';
import { fetchSingleUserProfile } from '@/Utils/userServices';

const props = defineProps<{
  role: string,
  id: string
}>()

const {
  form,
  errors,
  errorMessages,
  incidentTypeOptions,
  validateForm,
  setServerErrors
} = useBlotterReports();

const { addressOptions } = useCreateUserAccount();
const navigation = useGlobalLoadingStore();

const hasError = ref<boolean>(false);
const complainantFullName = ref<string>('')
const complainantAge = ref<string>('')
const complainantContactInfo = ref<string>('')
const address = ref<string>('')

const buildFullName = (profile: Partial<UserProfileType>): string => {
  const first = profile.first_name ?? ''
  const middle = profile.middle_name ?? ''
  const last = profile.last_name ?? ''
  return [first, middle, last].filter(Boolean).join(' ').trim()
}

const computeAge = (birthDate?: string | null): string => {
  if (!birthDate) return ''
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.valueOf())) return ''

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  const dayDiff = today.getDate() - birth.getDate()
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--
  }
  return age >= 0 ? `${age}` : ''
}

const fetchUserProfile = async () => {
  if (!props.id) return

  navigation.startNavigation();
  try {
    hasError.value = false
    const response = await fetchSingleUserProfile(props.id)
    const profile = (response.data?.profile ?? {}) as Partial<UserProfileType>

    complainantFullName.value = buildFullName(profile)
    complainantContactInfo.value = profile.mobile_number ?? ''
    const street = profile.street_address ?? ''
    const addressLine = profile.address_line ?? ''
    address.value = [street, addressLine].filter(Boolean).join(', ')
    complainantAge.value = computeAge(profile.date_of_birth)
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;
    const responseData = axiosError?.response?.data
    setServerErrors(responseData?.errors, responseData?.message ?? fallbackResponse?.message);
    hasError.value = true
  } finally {
    navigation.endNavigation();
  }
}

watch(() => props.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchUserProfile()
  }
}, { immediate: true })

const handleCreateBlotterReport = async () => {
  hasError.value = !validateForm();
  if (hasError.value) return;

  if (!props.id) {
    setServerErrors(undefined, 'Missing resident identifier for this request.');
    hasError.value = true;
    return;
  }

  const requestPayload: BlotterReportRequestPayload = {
    incident_type: form.value.incidentType,
    incident_title: form.value.incidentTitle,
    date_of_incident: form.value.dateOfIncident,
    time_of_incident: form.value.timeOfIncident,
    incident_street_address: form.value.incidentStreetAddress,
    incident_address_line: form.value.incidentAddressLine,
    incident_people_involved: form.value.incidentPeopleInvolved,
    incident_witnesses: form.value.incidentWitnesses,
    incident_description: form.value.incidentDescription,
    evidences: form.value.evidences,
  }

  navigation.startNavigation();
  try {
    const response = await submitBlotterReport(requestPayload, props.id);
    if (response.status !== 'success') {
      throw response;
    }
    hasError.value = false;
    router.push({ name: 'BlotterReports', params: { role: props.role } });
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    if (axiosError?.isAxiosError) {
      const responseData = axiosError.response?.data;
      setServerErrors(responseData?.errors, responseData?.message);
    } else if (fallbackResponse?.message) {
      setServerErrors(undefined, fallbackResponse.message);
    } else {
      setServerErrors(undefined, 'Failed to submit blotter report.');
    }

    hasError.value = true;
  } finally {
    navigation.endNavigation();
  }
}

const addPersonInvolvedField = () => {
  if (form.value.incidentPeopleInvolved.length > 10) return
  form.value.incidentPeopleInvolved.push('')
}

const addWitnessField = () => {
  if (form.value.incidentWitnesses.length > 10) return
  form.value.incidentWitnesses.push('')
}

const removePersonInvolvedField = (index: number) => {
  form.value.incidentPeopleInvolved.splice(index, 1);
}
const removeWitnessField = (index: number) => {
  form.value.incidentWitnesses.splice(index, 1);
}

const filteredErrors = computed(() => {
  return Object.values(errorMessages.value).filter(msg => msg.error && msg.error.trim() !== '');
});

</script>
<template>
  <div class="my-5">
    <FormContainer :has-error="hasError" title="Incident Report Form" :max-width="'976px'">
      <WarningLabel :has-error="hasError && filteredErrors.length > 0" :errors="filteredErrors" />
      <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleCreateBlotterReport">
        <section>
          <div class="border-bottom mb-4">
            <h5 class="mb-2">Complainant Information</h5>
          </div>
          <div class="row g-2">
            <div class="col-md-6 col-12">
              <FormFloatingInput type="text" label="Name of Complainant" id="complainant-name"
                v-model="complainantFullName" :is-disabled="true" />
            </div>
            <div class="col-md-6 col-12">
              <FormFloatingInput type="text" label="Age" id="complainant-age" v-model="complainantAge"
                :is-disabled="true" />
            </div>
          </div>
          <div class="row g-2">
            <div class="col-md-6 col-12">
              <FormFloatingInput type="text" label="Contact Information" id="complainant-mobile-number"
                v-model="complainantContactInfo" :is-disabled="true" />
            </div>
            <div class="col-md-6 col-12">
              <FormFloatingInput type="text" label="Address" id="address" v-model="address" :is-disabled="true" />
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col">
              <DropdownInput :options="orderedOptions(incidentTypeOptions)" label="Select Case Type" id="case-type"
                v-model="form.incidentType" :has-error="errors.incidentType"
                :error-message="errorMessages.incidentType.error" />
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col">
              <FormFloatingInput type="text" label="Subject of the Report" id="incident-title"
                v-model="form.incidentTitle" :has-error="errors.incidentTitle"
                :error-message="errorMessages.incidentTitle.error" :optional="true" />
            </div>
          </div>
          <div class="row g-2">
            <div class="col-md-6 col-12">
              <FormFloatingInput type="date" label="Date of Incident" id="incident-date" v-model="form.dateOfIncident"
                :max="maxDate()" />
            </div>
            <div class="col-md-6 col-12">
              <FormFloatingInput type="time" label="Time of Incident" id="incident-time"
                v-model="form.timeOfIncident" />
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-md-6 col-12">
              <DropdownInput :options="orderedOptions(addressOptions)" label="Where did it happened?"
                id="incident-location" v-model="form.incidentStreetAddress" :has-error="errors.incidentStreetAddress"
                :error-message="errorMessages.incidentStreetAddress.error" :is-optional="true" />
            </div>
            <div class="col-md-6 col-12">
              <FormFloatingInput type="text" label="landmark" id="landmark" v-model="form.incidentAddressLine"
                :has-error="errors.incidentAddressLine" :error-message="errorMessages.incidentAddressLine.error"
                :optional="true" />
            </div>
          </div>
        </section>
        <section>
          <div class="border-bottom mb-4">
            <h5 class="mb-2">Witnesses & People Involved</h5>
          </div>
          <div class="row g-2">
            <div class="col-md-6 col-12">
              <div class="row">
                <div class="col-2 pe-0">
                  <FormButton v-if="form.incidentPeopleInvolved.length <= 10" type="button" btn-display="primary"
                    :is-outlined="true" @click="addPersonInvolvedField">
                    <i class="bi bi-person-plus-fill"></i>
                  </FormButton>
                </div>
                <div class="col-10">
                  <div v-for="(person, index) in form.incidentPeopleInvolved" :key="`person-${index}`" class="mb-2 row">
                    <div class="col-10 pe-1 my-0">
                      <FormFloatingInput type="text" label="Person Involved" :id="`people-involved-${index + 1}`"
                        v-model="form.incidentPeopleInvolved[index]" :has-error="errors.incidentPeopleInvolved"
                        :error-message="errorMessages.incidentPeopleInvolved.error" :optional="true" />
                    </div>
                    <div v-if="index !== 0" class="col-2 px-1" style="margin-top: 11px;">
                      <button type="button" class=" btn btn-danger p-1"
                        @click.prevent="() => removePersonInvolvedField(index)"><i class="bi bi-x "></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12">
              <div class="row">
                <div class="col-2 pe-0">
                  <FormButton v-if="form.incidentWitnesses.length <= 10" type="button" btn-display="primary"
                    :is-outlined="true" @click="addWitnessField">
                    <i class="bi bi-person-plus-fill"></i>
                  </FormButton>
                </div>
                <div class="col-10">
                  <div v-for="(person, index) in form.incidentWitnesses" :key="`witness-${index}`" class="mb-2 row">
                    <div class="col-10 pe-1 my-0">
                      <FormFloatingInput type="text" label="Witness" :id="`witness-${index + 1}`"
                        v-model="form.incidentWitnesses[index]" :has-error="errors.incidentWitnesses"
                        :error-message="errorMessages.incidentWitnesses.error" :optional="true" />
                    </div>
                    <div v-if="index !== 0" class="col-2 px-1" style="margin-top: 11px;">
                      <button type="button" class=" btn btn-danger p-1"
                        @click.prevent="() => removeWitnessField(index)"><i class="bi bi-x "></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="border-bottom mb-4">
            <h5 class="mb-2">Description & Evidences</h5>
          </div>
          <div class="border p-4 bg-blue ">
            <div class="col-12">
              <FormTextAreaInput label="" id="certificate-request-purpose" v-model="form.incidentDescription"
                :error-message="errorMessages.incidentDescription.error" :has-error="errors.incidentDescription"
                :is-resizeable="false" max-rows="6" />
            </div>
            <div class="col-12">
              <UploadFiles v-model="form.evidences" />
            </div>
          </div>

        </section>
        <hr>
        <div class="col-md-6 col-sm-12 mx-auto ">
          <FormButton label="Submit" />
        </div>
      </form>
    </FormContainer>
  </div>
</template>

<style scoped>
.bg-blue {
  background-color: #0d6dfd12;
}
</style>
