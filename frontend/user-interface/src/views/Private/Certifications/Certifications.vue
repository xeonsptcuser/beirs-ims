<script setup lang="ts">
import FormCheckboxInput from '@/components/common/FormCheckboxInput/FormCheckboxInput.vue';
import FormSearchInput from '@/components/common/FormSearchInput/FormSearchInput.vue';
import Pagination from '@/components/common/Pagination/Pagination.vue';
import type { ApiErrorResponse, CertificateRequestsResponse, CommonResponse, PaginationLink, StatusOptions } from '@/Types';
import { fetchAllCertificates, fetchAllCertificatesById } from '@/Utils/certificateServices';
import { formatDateToHuman, formatName } from '@/Utils/helpers/formatters';
import { evaluateStatus } from '@/Utils/helpers/common-helpers';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import { computed, onMounted, reactive, ref } from 'vue';
import type { AxiosError } from 'axios';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';


defineProps<{ role: string }>();

// store variable decleration
const navigation = useGlobalLoadingStore();
const useSession = useSessionStore();

// custom typed variable decleration
const certificationRequestItems = ref<CertificateRequestsResponse[]>([])
const searchByNameKeyWord = ref<string>('');
const hasError = ref<boolean>(false);
const errorMessage = ref<string>('');
const isHistoryScreen = ref<boolean>(false);
const transactionStatuses = ['pending', 'approved', 'released'];
const historyStatuses = ['rejected', 'cancelled', 'done'];
const selectedStatusFilter = ref<StatusOptions | null>(null);

const title = computed(() => {
  return 'CERTIFICATE REQUEST LIST'
});

const pagination = reactive({
  current: 1,
  last: 1,
  perPage: 10,
  total: 0,
  links: [] as PaginationLink[],
});

const fetchCertificateRequests = async (page: number = pagination.current, search?: string, status?: string | null) => {
  navigation.startNavigation();
  let statuses = null
  const activeStatus = status ?? selectedStatusFilter.value
  if (activeStatus) {
    statuses = [activeStatus]
  } else {
    statuses = isHistoryScreen.value ? historyStatuses : transactionStatuses;
  }
  const baseParams = { page, per_page: pagination.perPage, statuses, search }

  try {
    const response = useSession.isRoleResident()
      ? await fetchAllCertificatesById({ ...baseParams, user_id: useSession.id })
      : await fetchAllCertificates(baseParams)

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

const toggleHistoryBtn = computed(() => {
  if (!isHistoryScreen.value) {
    return 'View History'
  }
  return 'View Transactions'
})

const handleSearchCertificates = () => {
  const trimmed = searchByNameKeyWord.value.trim()
  pagination.current = 1
  fetchCertificateRequests(1, trimmed || undefined)
  searchByNameKeyWord.value = ''
}

const toggleFetchHistoryTransactions = () => {
  isHistoryScreen.value = !isHistoryScreen.value
  selectedStatusFilter.value = null
  pagination.current = 1
  fetchCertificateRequests(pagination.current)
}

const filterCertificateRequests = (filterStr: StatusOptions, isChecked: boolean) => {
  pagination.current = 1
  if (isChecked) {
    selectedStatusFilter.value = filterStr
    fetchCertificateRequests(pagination.current, undefined, filterStr)
    return
  }

  if (selectedStatusFilter.value === filterStr) {
    selectedStatusFilter.value = null
    fetchCertificateRequests(pagination.current)
  }
}

onMounted(() => {
  fetchCertificateRequests()
})

</script>
<template>
  <div class="my-5 ">
    <WarningLabel :has-error="hasError" :errors="[{ error: errorMessage }]" />
    <div class="p-4 rounded border border-gray-500 bg-white">
      <div class="text-end me-2 mb-3 ">
        <a href="#" class="text-decoration-none text-secondary" @click.prevent="toggleFetchHistoryTransactions">
          <i class="bi bi-journal-text me-2"></i>{{ toggleHistoryBtn }}
        </a>
      </div>
      <div class="row mb-0 mb-md-4">
        <h3 class="text-center tracking-wider mb-3 mb-md-0" :class="{ 'col-10 col-md-9': useSession.isRoleResident() }">
          {{ title }}
        </h3>
        <div class="col-2 col-md-3" v-if="useSession.isRoleResident()">
          <router-link v-if="useSession.isLoggedIn()" :to="{
            name: 'CreateCertification',
            params: { role, id: useSession.id }
          }" class="btn btn-outline-success py-2">
            <i class="bi bi-file-earmark me-1"></i> <span class="d-none d-md-inline-block">Request Certificate</span>
          </router-link>
        </div>
      </div>

      <div class="d-md-flex justify-content-between my-3 g-2 align-items-center ">
        <form @submit.prevent="handleSearchCertificates" class="col-md-3 col-12 mb-3 mb-md-0">
          <FormSearchInput v-model="searchByNameKeyWord" />
        </form>
        <div class="col-md-7 col-12 row align-items-center gx-2">
          <!-- MOBILE SCREEN -->
          <p class="font-bold col-md-3 my-auto d-md-none d-block">Filter:</p>
          <FormCheckboxInput id="filter-pending-sm" label="Pending" class="col-12 col-md-3 d-md-none form-check-reverse"
            v-if="!isHistoryScreen" :model-value="selectedStatusFilter === 'pending'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'pending'"
            @change="(checked) => filterCertificateRequests('pending', checked)" />
          <FormCheckboxInput id="filter-approved-sm" label="Approved"
            class="col-12 col-md-3 d-md-none form-check-reverse" v-if="!isHistoryScreen"
            :model-value="selectedStatusFilter === 'approved'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'approved'"
            @change="(checked) => filterCertificateRequests('approved', checked)" />
          <FormCheckboxInput id="filter-released-sm" label="Released"
            class="col-12 col-md-3 d-md-none form-check-reverse" v-if="!isHistoryScreen"
            :model-value="selectedStatusFilter === 'released'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'released'"
            @change="(checked) => filterCertificateRequests('released', checked)" />
          <FormCheckboxInput id="filter-rejected-sm" label="Rejected"
            class="col-12 col-md-3 d-md-none form-check-reverse" v-if="isHistoryScreen"
            :model-value="selectedStatusFilter === 'rejected'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'rejected'"
            @change="(checked) => filterCertificateRequests('rejected', checked)" />
          <FormCheckboxInput id="filter-cancelled-sm" label="Cancelled"
            class="col-12 col-md-3 d-md-none form-check-reverse" v-if="isHistoryScreen"
            :model-value="selectedStatusFilter === 'cancelled'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'cancelled'"
            @change="(checked) => filterCertificateRequests('cancelled', checked)" />
          <FormCheckboxInput id="filter-done-sm" label="Done" class="col-12 col-md-3 d-md-none form-check-reverse ps-3"
            v-if="isHistoryScreen" :model-value="selectedStatusFilter === 'done'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'done'"
            @change="(checked) => filterCertificateRequests('done', checked)" />

          <!-- DESKTOP SCREEN -->
          <p class="font-bold col-md-3 my-auto d-md-block d-none">Filter:</p>
          <FormCheckboxInput id="filter-pending-md" label="Pending" class="col-md-3 d-none d-md-block"
            v-if="!isHistoryScreen" :model-value="selectedStatusFilter === 'pending'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'pending'"
            @change="(checked) => filterCertificateRequests('pending', checked)" />
          <FormCheckboxInput id="filter-approved-md" label="Approved" class="col-md-3 d-none d-md-block"
            v-if="!isHistoryScreen" :model-value="selectedStatusFilter === 'approved'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'approved'"
            @change="(checked) => filterCertificateRequests('approved', checked)" />
          <FormCheckboxInput id="filter-released-md" label="Released" class="col-md-3 d-none d-md-block"
            v-if="!isHistoryScreen" :model-value="selectedStatusFilter === 'released'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'released'"
            @change="(checked) => filterCertificateRequests('released', checked)" />
          <FormCheckboxInput id="filter-rejected-md" label="Rejected" class="col-md-3 d-none d-md-block"
            v-if="isHistoryScreen" :model-value="selectedStatusFilter === 'rejected'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'rejected'"
            @change="(checked) => filterCertificateRequests('rejected', checked)" />
          <FormCheckboxInput id="filter-cancelled-md" label="Cancelled" class="col-md-3 d-none d-md-block"
            v-if="isHistoryScreen" :model-value="selectedStatusFilter === 'cancelled'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'cancelled'"
            @change="(checked) => filterCertificateRequests('cancelled', checked)" />
          <FormCheckboxInput id="filter-done-md" label="Done" class="col-md-3 d-none d-md-block" v-if="isHistoryScreen"
            :model-value="selectedStatusFilter === 'done'"
            :disabled="!!selectedStatusFilter && selectedStatusFilter !== 'done'"
            @change="(checked) => filterCertificateRequests('done', checked)" />
        </div>
      </div>

      <table class="table" v-show="!navigation.isNavigating">
        <thead class="table-secondary">
          <tr>
            <th scope="col" class="py-3 border-end border-white" v-show="!useSession.isRoleResident()">Name</th>
            <th scope="col" class="py-3 border-end border-white">Type</th>
            <th scope="col" class="d-none d-md-table-cell py-3 border-end border-white">Date Submitted</th>
            <th scope="col" class="py-3 border-end border-white d-none d-md-table-cell">Status</th>
            <th scope="col" colspan="2" class="text-center py-3 border-end border-white">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(certificate, i) in certificationRequestItems" :key="i">
            <td class="align-middle " v-show="!useSession.isRoleResident()">
              <p class="mb-0 py-1 text-md ps-2 text-capitalize">{{ formatName(certificate.profile.first_name,
                certificate.profile.middle_name, certificate.profile.last_name) ?? '-' }}</p>
            </td>
            <td class="align-middle">
              <p class="mb-0 py-1 text-md ps-2 text-capitalize">{{ certificate.cert_request_type ?? '-' }}</p>
            </td>
            <td class="align-middle d-none d-md-table-cell">
              <p class="mb-0 py-1 text-md ps-2 ">{{ formatDateToHuman(certificate.created_at) ?? '-' }}</p>
            </td>
            <td class="align-middle d-none d-md-table-cell">
              <p class="mb-0 py-1 text-md ps-2 text-capitalize badge"
                :class="evaluateStatus(certificate.status ?? '-')">{{ certificate.status ?? '-' }}</p>
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
