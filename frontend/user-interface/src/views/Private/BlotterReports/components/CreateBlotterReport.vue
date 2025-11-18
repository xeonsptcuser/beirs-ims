<script setup lang="ts">
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import { computed, ref } from 'vue';
import { useBlotterReports } from '../composable/useBlotterReport';
import FormFloatingInput from '@/components/common/FormFloatingInput/FormFloatingInput.vue';
import DropdownInput from '@/components/common/DropdownInput/DropdownInput.vue';
import { useCreateUserAccount } from '../../Residents/composable/useCreateUserAccount';
import FormButton from '@/components/common/FormButton/FormButton.vue';

defineProps<{
  role: string
}>()

const {
  form,
  errors,
  errorMessages,
  incidentTypeOptions,
  validateForm
} = useBlotterReports();

const { addressOptions } = useCreateUserAccount();

const hasError = ref<boolean>(false);
const complainantFullName = ref<string>('')
const complainantAge = ref<string>('')
const complainantContactInfo = ref<string>('')
const address = ref<string>('')

const handleCreateBlotterReport = async () => {
  // HANDLE CREATE BLOTTER REPORT HERE
}

const addPersonInvolvedField = () => {
  form.value.incidentPeopleInvolved.push('')
}

const removePersonInvolvedField = (index: number) => {
  form.value.incidentPeopleInvolved.splice(index, 1);
}

const filteredErrors = computed(() => {
  return Object.values(errorMessages.value).filter(msg => msg.error && msg.error.trim() !== '');
});

</script>
<template>
  <div class="my-5">
    <FormContainer :has-error="hasError" title="Incident Report Form" :max-width="'750px'">
      <WarningLabel :has-error="hasError && filteredErrors.length > 0" :errors="filteredErrors" />
      <div class="border-bottom mb-4">
        <h5 class="mb-2">Complainant Information</h5>
      </div>
      <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleCreateBlotterReport">
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
        <div class="row g-2">
          <div class="col">
            <DropdownInput :options="incidentTypeOptions" label="Incident Type" id="incident-type"
              v-model="form.incidentType" :has-error="errors.incidentType"
              :error-message="errorMessages.incidentType.error" />
          </div>
        </div>
        <div class="row g-2">
          <div class="col-md-6 col-12">
            <FormFloatingInput type="date" label="Date of Incident" id="incident-date" v-model="form.dateOfIncident" />
          </div>
          <div class="col-md-6 col-12">
            <FormFloatingInput type="time" label="Time of Incident" id="incident-time" v-model="form.timeOfIncident" />
          </div>
        </div>
        <div class="row g-2 mb-4">
          <div class="col-md-6 col-12">
            <DropdownInput :options="addressOptions" label="Scene of the Incident" id="scene-of-the-incident"
              v-model="form.incidentStreetAddress" :has-error="errors.incidentStreetAddress"
              :error-message="errorMessages.incidentStreetAddress.error" :is-optional="true" />
          </div>
          <div class="col-md-6 col-12">
            <FormFloatingInput type="text" label="Landmark" id="landmark" v-model="form.incidentAddressLine"
              :has-error="errors.incidentAddressLine" :error-message="errorMessages.incidentAddressLine.error" />
          </div>
        </div>
        <div class="border-bottom mb-3">
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
                    <button type="button" class=" btn btn-outline-danger p-1"
                      @click.prevent="() => removePersonInvolvedField(index)"><i class="bi bi-x "></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12">WITNESSES</div>
        </div>
      </form>
    </FormContainer>

  </div>
</template>
