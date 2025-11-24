<script setup lang="ts">
import FormCheckboxInput from '@/components/common/FormCheckboxInput/FormCheckboxInput.vue';
import FormSearchInput from '@/components/common/FormSearchInput/FormSearchInput.vue';
import Pagination from '@/components/common/Pagination/Pagination.vue';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import type { ApiErrorResponse, CertificateRequestsResponse, CommonResponse, PaginationLink, StatusOptions, User } from '@/Types';
import { fetchAllCertificates, fetchAllCertificatesById } from '@/Utils/certificateServices';
import { formatDateToHuman, formatName } from '@/Utils/helpers/formatters';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import { computed, onMounted, reactive, ref } from 'vue';
import type { AxiosError } from 'axios';
import { fetchSingleUserProfile } from '@/Utils/userServices';


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
const userProfile = ref<User | null>(null);
const isLoadingProfile = ref<boolean>(false);
const profileErrorMessage = ref<string>('');

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

const statusBadgeClass = (status: StatusOptions | string) => {
  const mapping: Record<string, string> = {
    pending: 'bg-warning text-dark',
    approved: 'bg-primary',
    released: 'bg-success',
    rejected: 'bg-danger',
    cancelled: 'bg-secondary',
    done: 'bg-success',
  };
  return mapping[status] ?? 'bg-secondary';
};

const formatStatusLabel = (status: StatusOptions | string) => String(status).replace(/_/g, ' ').toUpperCase();

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

const isProfileIncomplete = computed(() => {
  const profile = userProfile.value?.profile;
  if (!profile) {
    return false;
  }

  const missingMobile = !profile.mobile_number || !profile.mobile_number.trim();
  const missingAddress = !profile.street_address || !profile.street_address.trim();
  const unverifiedMobile = !profile.mobile_verified_at;
  const hasNoGovtId = !profile.government_identity;
  const isInactive = profile.is_active === false;

  return missingMobile || missingAddress || unverifiedMobile || hasNoGovtId || isInactive;
});

const shouldBlockActions = computed(
  () => isProfileIncomplete.value && !isLoadingProfile.value && !profileErrorMessage.value
);

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

    console.log(paginator.data);
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

const fetchUserProfile = async () => {
  if (!useSession.isRoleResident() || !useSession.id) {
    return;
  }

  isLoadingProfile.value = true;
  profileErrorMessage.value = '';

  try {
    const response = await fetchSingleUserProfile(useSession.id.toString());

    if (response.status !== 'success') {
      throw response;
    }

    userProfile.value = response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    if (axiosError?.isAxiosError) {
      const responseData = axiosError.response?.data;
      profileErrorMessage.value = responseData?.message ?? 'Failed to fetch user profile info.';
    } else if (fallbackResponse?.message) {
      profileErrorMessage.value = fallbackResponse.message;
    } else {
      profileErrorMessage.value = 'Failed to fetch user profile info.';
    }
  } finally {
    isLoadingProfile.value = false;
  }
};

const handleBlockedNavigation = (event: Event) => {
  if (shouldBlockActions.value) {
    event.preventDefault();
  }
};

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
  fetchUserProfile()
})

</script>
<template>
  <div class="my-5">
    <div
      class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3">
      <div>
        <p class="text-muted text-uppercase mb-1 small">Requests</p>
        <h2 class="fw-bold mb-0">Certificate Center</h2>
        <p class="text-secondary small mb-0">Track certificate requests, review statuses, and manage releases.</p>
      </div>
      <div class="d-flex flex-column align-items-end gap-2">
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-link text-decoration-none" type="button" v-if="!isStaffView"
            @click.prevent="toggleFetchHistoryTransactions">
            <i class="bi bi-journal-text me-2"></i>{{ toggleHistoryBtn }}
          </button>
          <router-link v-if="createCertificateRoute" :to="createCertificateRoute" class="btn btn-primary"
            :class="{ disabled: shouldBlockActions }" :aria-disabled="shouldBlockActions"
            :tabindex="shouldBlockActions ? -1 : 0" @click="handleBlockedNavigation">
            <i class="bi bi-file-earmark-plus me-2"></i> Request Certificate
          </router-link>
        </div>
        <p v-if="shouldBlockActions" class="text-danger small fw-semibold mb-0">Complete your profile verification to
          request
          a certificate.</p>
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
              <FormCheckboxInput v-for="status in activeStatusFilters" :key="status" :id="`filter-${status}`"
                :label="status.toUpperCase()" :model-value="selectedStatusFilter === status"
                :disabled="!!selectedStatusFilter && selectedStatusFilter !== status"
                @change="(checked) => filterCertificateRequests(status, checked)" />
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-xl-8">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-2 mb-3">
              <div>
                <p class="text-muted small mb-1">Showing</p>
                <p class="fw-bold mb-0">Page {{ pagination.current }} of {{ pagination.last }}</p>
              </div>
              <Pagination :links="pagination.links" :current-page="pagination.current"
                @change="(page) => fetchCertificateRequests(page)" v-if="pagination.links.length > 1" />
            </div>

            <div v-if="!certificationRequestItems.length && !hasError" class="text-center py-5 bg-light rounded">
              <i class="bi bi-file-earmark-text display-4 text-muted"></i>
              <p class="mt-3 mb-1 fw-semibold">No certificate requests found.</p>
              <p class="text-secondary mb-3">Request a new certificate or adjust filters to view past submissions.</p>
              <router-link v-if="createCertificateRoute" :to="createCertificateRoute" class="btn btn-primary"
                :class="{ disabled: shouldBlockActions }" :aria-disabled="shouldBlockActions"
                :tabindex="shouldBlockActions ? -1 : 0" @click="handleBlockedNavigation">
                Request Certificate
              </router-link>
            </div>

            <div class="row gy-3" v-else>
              <div class="col-12" v-for="request in certificationRequestItems" :key="request.id">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <div class="d-flex gap-3 align-items-center mb-1">
                          <span class="badge rounded-pill px-3 py-2" :class="statusBadgeClass(request.status)">
                            {{ formatStatusLabel(request.status) }}
                          </span>
                          <small class="text-muted">{{ formatDateToHuman(request.created_at) || '—' }}</small>
                        </div>
                        <h5 class="card-title mb-1">{{ request.cert_request_type || 'Certificate Request' }}</h5>
                        <p class="text-secondary mb-2">Purpose: {{ truncatedPurpose(request.cert_request_reason) }}</p>
                        <p class="text-muted small mb-0" v-if="request.profile">
                          Requested by: {{ formatName(request.profile.first_name, request.profile.middle_name,
                          request.profile.last_name) }}
                        </p>
                      </div>
                      <div class="text-end">
                        <p class="text-muted small mb-1">{{ formatCaseId(request.id) }}</p>
                        <router-link class="btn btn-outline-primary btn-sm"
                          :to="{ name: 'ViewCertificateRequest', params: { role, id: request.id } }">
                          View Details
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <h5 class="fw-bold mb-3">Status Overview</h5>
            <div class="list-group list-group-flush">
              <div class="list-group-item px-0 d-flex justify-content-between align-items-center"
                v-for="status in activeStatusFilters" :key="status">
                <span class="text-uppercase small fw-semibold">{{ status }}</span>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge" :class="statusBadgeClass(status)"></span>
                  <span class="fw-bold">{{
                    certificationRequestItems.filter((item) => item.status === status).length
                  }}</span>
                </div>
              </div>
            </div>

            <hr />

            <h5 class="fw-bold mb-3">Quick Filters</h5>
            <div class="d-flex flex-wrap gap-2">
              <FormCheckboxInput v-for="status in activeStatusFilters" :key="status" :id="`quick-${status}`"
                :label="status.toUpperCase()" :model-value="selectedStatusFilter === status"
                :disabled="!!selectedStatusFilter && selectedStatusFilter !== status"
                @change="(checked) => filterCertificateRequests(status, checked)" />
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>
