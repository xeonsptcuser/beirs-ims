<script setup lang="ts">
import Pagination from '@/components/common/Pagination/Pagination.vue';
import type { PaginationLink } from '@/Types';
import type { CertificateRequestsResponse } from '@/Types/certificate-related-types';
import { fetchAllCertificates } from '@/Utils/certificateServices';
import { formatDateToHuman, formatName } from '@/Utils/helpers/formatters';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import { reactive, ref, watchEffect } from 'vue';


defineProps<{ role: string }>();

const navigation = useGlobalLoadingStore();
const certificationRequestItems = ref<CertificateRequestsResponse[]>([])
const useSession = useSessionStore();

const pagination = reactive({
  current: 1,
  last: 1,
  perPage: 10,
  total: 0,
  links: [] as PaginationLink[],
});

const fetchCertificateRequests = async (page: number = pagination.current) => {
  navigation.startNavigation();
  let response = null;
  try {
    if (useSession.isRoleResident()) {
      response = await fetchAllCertificates({ page, per_page: pagination.perPage, user_id: useSession.id })
    } else {
      response = await fetchAllCertificates({ page, per_page: pagination.perPage })
    }

    if (response.status !== 'success') {
      throw response;
    }

    const paginator = response.data;
    certificationRequestItems.value = paginator.data ?? [];
    pagination.current = paginator.current_page ?? 1;
    pagination.last = paginator.last_page ?? 1;
    pagination.total = paginator.total ?? 0;
    pagination.links = paginator.links ?? [];

  } catch (error) {
    console.log(error)
  } finally {
    navigation.endNavigation()
  }
}

watchEffect(() => {
  fetchCertificateRequests()
})

</script>
<template>
  <div class="my-5 ">
    <div class="p-4 rounded border border-gray-500 bg-white">
      <div class="row mb-0 mb-md-4">
        <h3 class="text-center tracking-wider mb-3 mb-md-0 mt-md-2"
          :class="{ 'col-10 col-md-9': useSession.isRoleResident() }">CERTIFICATE REQUEST LIST</h3>
        <div class="col-2 col-md-3" v-if="useSession.isRoleResident()">
          <router-link v-if="useSession.isLoggedIn()" :to="{
            name: 'CreateCertification',
            params: { role, id: useSession.id }
          }" class="btn btn-outline-success py-2">
            <i class="bi bi-file-earmark me-1"></i> <span class="d-none d-md-inline-block">Request Certificate</span>
          </router-link>
        </div>
      </div>

      <table class="table" v-show="!navigation.isNavigating">
        <thead class="table-secondary">
          <tr>
            <th scope="col" class="py-3 border-end border-white" v-show="useSession.isRoleAdmin()">Name</th>
            <th scope="col" class="py-3 border-end border-white">Type</th>
            <th scope="col" class="d-none d-lg-table-cell py-3 border-end border-white">Date Submitted</th>
            <th scope="col" class="py-3 border-end border-white">Status</th>
            <th scope="col" colspan="2" class="text-center py-3 border-end border-white">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(certificate, i) in certificationRequestItems" :key="i">
            <td class="align-middle" v-show="useSession.isRoleAdmin()">
              <p class="mb-0 py-1 text-md ps-2 text-capitalize">{{ formatName(certificate.profile.first_name,
                certificate.profile.middle_name, certificate.profile.last_name) ?? '-' }}</p>
            </td>
            <td class="align-middle">
              <p class="mb-0 py-1 text-md ps-2 text-capitalize">{{ certificate.cert_request_type ?? '-' }}</p>
            </td>
            <td class="align-middle d-none d-lg-table-cell">
              <p class="mb-0 py-1 text-md ps-2 ">{{ formatDateToHuman(certificate.created_at) ?? '-' }}</p>
            </td>
            <td class="align-middle">
              <p class="mb-0 py-1 text-md ps-2 text-capitalize">{{ certificate.status ?? '-' }}</p>
            </td>
            <td class="align-middle text-center">
              <router-link :to="{ name: 'ViewCertificateRequest', params: { role, id: certificate.id } }"
                class="btn btn-primary">
                View
              </router-link>
            </td>
          </tr>
        </tbody>

      </table>
      <Pagination v-if="!navigation.isNavigating" class="d-flex justify-content-center" :links="pagination.links"
        :disabled="navigation.isNavigating" :current-page="pagination.current" @change="fetchCertificateRequests" />
    </div>
  </div>
</template>
