<script setup lang="ts">
import FormCheckboxInput from '@/components/common/FormCheckboxInput/FormCheckboxInput.vue';
import FormSearchInput from '@/components/common/FormSearchInput/FormSearchInput.vue';
import Pagination from '@/components/common/Pagination/Pagination.vue';
import type { ApiErrorResponse, CertificateRequestsResponse, CommonResponse, PaginationLink, StatusOptions } from '@/Types';
import { fetchAllCertificates, fetchAllCertificatesById } from '@/Utils/certificateServices';
import { formatDateToHuman, formatName } from '@/Utils/helpers/formatters';
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
const selectedStatusFilter = ref<StatusOptions | null>(null);
const isStaffView = computed(() => useSession.isRoleStaff());
const transactionStatuses = computed<StatusOptions[]>(() => isStaffView.value
  ? ['pending', 'approved']
  : ['pending', 'approved', 'released']
);
const historyStatuses = computed<StatusOptions[]>(() => isStaffView.value
  ? []
  : ['rejected', 'cancelled', 'done']
);

const summaryStats = computed(() => {
  const items = certificationRequestItems.value;
  const total = pagination.total ?? items.length;
  const pending = items.filter((item) => item.status === 'pending').length;
  const approved = items.filter((item) => item.status === 'approved').length;
  const released = items.filter((item) => item.status === 'released').length;

  return [
    { label: 'Total Requests', value: total, accent: 'text-primary' },
    { label: 'Pending', value: pending, accent: 'text-warning' },
    { label: isStaffView.value ? 'Approved' : 'Approved', value: approved, accent: 'text-success' },
    { label: 'Released', value: released, accent: 'text-info' },
  ];
});

const activeStatusFilters = computed(() => (isHistoryScreen.value ? historyStatuses.value : transactionStatuses.value));

const statusBadgeClass = (status: StatusOptions) => {
  const mapping: Record<StatusOptions, string> = {
    pending: 'bg-warning text-dark',
    approved: 'bg-primary',
    released: 'bg-success',
    rejected: 'bg-danger',
    cancelled: 'bg-secondary',
    done: 'bg-success',
  };
  return mapping[status] ?? 'bg-secondary';
};

const formatStatusLabel = (status: StatusOptions) => status.replace(/_/g, ' ').toUpperCase();

const truncatedPurpose = (text?: string) => {
  if (!text) return 'No purpose indicated.';
  if (text.length <= 120) return text;
  return `${text.slice(0, 120)}...`;
};

const formatCaseId = (id: number) => `CERT-${id.toString().padStart(4, '0')}`;

const createCertificateRoute = computed(() => {
  if (!useSession.isRoleResident() || !useSession.isLoggedIn()) {
    return null;
  }

  return {
    name: 'CreateCertification',
    params: { role: useSession.role, id: useSession.id },
  };
});

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

const fetchCertificateRequests = async (page: number = pagination.current, search?: string, status?: StatusOptions | null) => {
  navigation.startNavigation();
  let statuses: StatusOptions[] | null = null
  const activeStatus = status ?? selectedStatusFilter.value
  if (activeStatus) {
    statuses = [activeStatus]
  } else {
    const defaultStatuses = isHistoryScreen.value ? historyStatuses.value : transactionStatuses.value;
    statuses = defaultStatuses.length ? defaultStatuses : null;
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

const resetSearch = () => {
  searchByNameKeyWord.value = ''
  pagination.current = 1
  fetchCertificateRequests()
}

const toggleFetchHistoryTransactions = () => {
  if (isStaffView.value) {
    return
  }
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
  <div class="my-5">
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3">
      <div>
        <p class="text-muted text-uppercase mb-1 small">Requests</p>
        <h2 class="fw-bold mb-0">Certificate Center</h2>
        <p class="text-secondary small mb-0">Track certificate requests, review statuses, and manage releases.</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-link text-decoration-none" type="button" v-if="!isStaffView"
          @click.prevent="toggleFetchHistoryTransactions">
          <i class="bi bi-journal-text me-2"></i>{{ toggleHistoryBtn }}
        </button>
        <router-link v-if="createCertificateRoute" :to="createCertificateRoute" class="btn btn-primary">
          <i class="bi bi-file-earmark-plus me-2"></i> Request Certificate
        </router-link>
      </div>
    </div>

    <WarningLabel :has-error="hasError" :errors="hasError ? [{ error: errorMessage }] : []" />

    <div class="row g-3 mb-4">
      <div class="col-md-3" v-for="stat in summaryStats" :key="stat.label">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">{{ stat.label }}</p>
            <h4 class="fw-bold mb-0" :class="stat.accent">{{ stat.value }}</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <form class="row gy-3 align-items-center" @submit.prevent="handleSearchCertificates">
          <div class="col-md-6 col-lg-4">
            <FormSearchInput v-model="searchByNameKeyWord" />
          </div>
          <div class="col-md-6 col-lg-4 d-flex gap-2">
            <button class="btn btn-primary w-100" type="submit">Search</button>
            <button class="btn btn-outline-secondary w-100" type="button" @click="resetSearch">Reset</button>
          </div>
          <div class="col-lg-4 text-lg-end text-md-start">
            <p class="text-muted small mb-1">Filter by Status</p>
            <div class="d-flex flex-wrap gap-2">
              <FormCheckboxInput v-for="status in activeStatusFilters" :key="status"
                :id="`filter-${status}`" :label="status.toUpperCase()" :model-value="selectedStatusFilter === status"
                :disabled="!!selectedStatusFilter && selectedStatusFilter !== status"
                @change="(checked) => filterCertificateRequests(status, checked)" />
            </div>
          </div>
        </form>
      </div>
    </div>

    <div v-if="!certificationRequestItems.length && !navigation.isNavigating" class="text-center py-5 bg-light rounded">
      <i class="bi bi-file-earmark-text display-4 text-muted"></i>
      <p class="mt-3 mb-1 fw-semibold">No certificate requests found.</p>
      <p class="text-secondary mb-0">Adjust your filters or file a new request.</p>
    </div>

    <div class="row row-cols-1 row-cols-xl-2 g-4" v-else>
      <div class="col" v-for="request in certificationRequestItems" :key="request.id">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start">
              <span class="badge rounded-pill px-3 py-2 text-uppercase" :class="statusBadgeClass(request.status)">
                {{ formatStatusLabel(request.status) }}
              </span>
              <small class="text-muted">{{ formatDateToHuman(request.created_at) || '—' }}</small>
            </div>
            <p class="text-muted text-uppercase small mt-2 mb-1">{{ formatCaseId(request.id) }}</p>
            <h5 class="card-title text-dark">{{ request.cert_request_type }}</h5>
            <p class="text-secondary small mb-2" v-if="!useSession.isRoleResident()">
              {{ formatName(request.profile.first_name, request.profile.middle_name, request.profile.last_name) }}
            </p>
            <p class="text-muted flex-grow-1">{{ truncatedPurpose(request.cert_request_reason) }}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div class="text-secondary small">
                <span>Requested: {{ formatDateToHuman(request.created_at) || '—' }}</span>
                <span class="mx-2 d-none d-md-inline">•</span>
                <span v-if="!useSession.isRoleResident()">Residency: {{ request.is_current ? 'Present' : formatDateToHuman(request.start_residency_date || '') || '—' }}</span>
              </div>
              <router-link class="btn btn-sm btn-outline-primary"
                :to="{ name: 'ViewCertificateRequest', params: { role, id: request.id } }">
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center mt-4" v-if="pagination.links.length > 1">
      <Pagination :links="pagination.links" :disabled="navigation.isNavigating" :current-page="pagination.current"
        @change="fetchCertificateRequests" />
    </div>
  </div>
</template>
