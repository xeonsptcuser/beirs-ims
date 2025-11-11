<script setup lang="ts">
import Pagination from '@/components/common/Pagination/Pagination.vue';
import type { PaginationLink } from '@/Types';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { reactive } from 'vue';


defineProps<{ role: string }>();

const navigation = useGlobalLoadingStore();
const certificationRequestItems = [
  {
    type: 'indigency',
    dateSubmitted: '2025-11-13',
    status: 'pending',

  }
]

const pagination = reactive({
  current: 1,
  last: 1,
  perPage: 10,
  total: 0,
  links: [] as PaginationLink[],
});

const fetchCertificateRequests = async () => {
  console.log('PAGINATION TRIGGERED')
}

</script>
<template>
  <div class="my-5 ">
    <div class="alert alert-warning" role="alert">
      CERTIFICATION VIEW PAGE HERE.... 🎉sasa Logged in as "{{ role }}"
    </div>
    <div class="p-4 rounded border border-gray-500 ">
      <h3 class="text-center tracking-wider">CERTIFICATE REQUESTS</h3>
      <table class="table" v-show="!navigation.isNavigating">
        <thead class="table-secondary">
          <tr>
            <th scope="col">Type</th>
            <th scope="col" class="text-left">Date Submitted</th>
            <th scope="col" class="text-left">Status</th>
            <th scope="col" colspan="2" class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(certificate, i) in certificationRequestItems" :key="i">
            <td class="align-middle">
              <p class="mb-0 py-1 text-md ps-2 text-capitalize">{{ certificate.type ?? '-' }}</p>
            </td>
            <td class="align-middle">
              <p class="mb-0 py-1 text-md ps-2 ">{{ certificate.dateSubmitted ?? '-' }}</p>
            </td>
            <td class="align-middle">
              <p class="mb-0 py-1 text-md ps-2 text-capitalize">{{ certificate.status ?? '-' }}</p>
            </td>
            <td class="align-middle text-center">
              <button type="button" class="btn btn-primary"> view</button>
            </td>
          </tr>
        </tbody>

      </table>
      <Pagination v-if="!navigation.isNavigating" class="d-flex justify-content-center" :links="pagination.links"
        :disabled="navigation.isNavigating" :current-page="pagination.current" @change="fetchCertificateRequests" />
    </div>
  </div>
</template>
