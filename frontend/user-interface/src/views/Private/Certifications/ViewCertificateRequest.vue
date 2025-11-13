<script setup lang="ts">
import FormButton from '@/components/common/FormButton/FormButton.vue';
import InfoField from './components/InfoField.vue';
import InfoFieldTextArea from './components/InfoFieldTextArea.vue';
import { ref } from 'vue';

const props = defineProps<{
  role: string,
  id: string
}>()

const isCancelled = ref<boolean>(false);

const handleCancelCertRequest = async () => {
  const userConfirmed = globalThis.confirm('Are you sure you want to cancel this request?');
  if (!userConfirmed) return;

  // HANDLE CANCEL FUNCTIONALITY HERE
  console.log('TRIGGERED CANCEL BUTTON');
};

//

</script>
<template>
  <div class="my-5">
    <div class="p-2 p-md-4 rounded border border-gray-500 bg-white">
      <div class="col-10 mx-auto">
        <div class="my-3">
          <h3 class="text-center">Certificate Request Information</h3>
        </div>
        <div class="rounded border border-gray-500 px-2 py-4">
          <div class="row">
            <InfoField label="Certificate Type" data-value="Residency" />
            <InfoField label="Request Status" data-value="Pending" />
          </div>
          <div class="row">
            <InfoField label="Complete Name" data-value="Ryann Greenhorn Waller" />
            <InfoField label="Age" data-value="24 years old" />
          </div>
          <div class="row">
            <InfoField label="Street Address" data-value="Sitio ABC 123" />
            <InfoField label="Mobile Number" data-value="(+63) 912 123 1234" />
          </div>
          <div class="row">
            <InfoField label="Start Residency Date" data-value="November 12, 2021" />
            <InfoField label="End Residency Date" data-value="Current" />
          </div>
          <div class="mb-1">
            <InfoFieldTextArea label="Purpose" data-value="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus
              quam eos non maxime asperiores mollitia velit fugiat ex aliquam deleniti quidem impedit, numquam nulla
              dicta sed architecto, consequuntur distinctio suscipit" />
          </div>
          <div class="row">
            <InfoField label="Date Submitted" data-value="November 12, 2025" />
            <InfoField label="Date Modified" data-value="November 13, 2025" />
          </div>
        </div>
        <div class="col-md-4 col-sm-12 mx-auto my-3">
          <FormButton type="button" label="Cancel" :btn-display="isCancelled ? 'secondary' : 'danger'"
            @Click.prevent="handleCancelCertRequest" :is-disabled="isCancelled" />
        </div>
      </div>
    </div>
  </div>
</template>


<!--
<p> Status: Pending</p>
<p>Name: Ryann Greenhorn Waller Age: 24 years old</p>
<p>Street Address: Sitio ABC 123 - Mobile Number: (+63) 912 123 1234</p>
<p>Start Residency Date: November 12, 2021 - End Residency Date: January 12, 2025</p>
<p>Date Submitted: November 12, 2025 </p>
<p>Reason for Certificate Request: Wa lang trip ko lang</p>
          -->
