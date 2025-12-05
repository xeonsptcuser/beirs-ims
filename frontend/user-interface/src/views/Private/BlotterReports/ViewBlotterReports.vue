<script setup lang="ts">
import FormCheckboxInput from '@/components/common/FormCheckboxInput/FormCheckboxInput.vue';
import FormSearchInput from '@/components/common/FormSearchInput/FormSearchInput.vue';
import Pagination from '@/components/common/Pagination/Pagination.vue';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import { fetchAllBlotterReports, fetchAllBlotterReportsById } from '@/Utils/blotterReportServices';
import { formatDateToHuman } from '@/Utils/helpers/formatters';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import type {
  ApiErrorResponse,
  BlotterReportResponse,
  BlotterReportStatus,
  CommonResponse,
  PageInfo,
  PaginationLink,
  User,
} from '@/Types';
import type { AxiosError } from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
import { fetchSingleUserProfile } from '@/Utils/userServices';

const props = defineProps<{ role: string }>();

const navigation = useGlobalLoadingStore();
const session = useSessionStore();

const blotterReports = ref<BlotterReportResponse[]>([]);
const userProfile = ref<User | null>(null);
const searchKeyword = ref<string>('');
const hasError = ref<boolean>(false);
const errorMessage = ref<string>('');
const isHistoryScreen = ref<boolean>(false);
const selectedStatusFilter = ref<BlotterReportStatus | null>(null);
const isLoadingProfile = ref<boolean>(false);
const profileErrorMessage = ref<string>('');

const pagination = reactive({
  current: 1,
  last: 1,
  perPage: 8,
  total: 0,
  links: [] as PaginationLink[],
});

const isStaffView = computed(() => session.isRoleStaff() || session.isRoleAdmin());
const isResidentView = computed(() => session.isRoleResident());

const residentTransactionStatuses: BlotterReportStatus[] = ['pending', 'approved', 'processing', 'released'];
const residentHistoryStatuses: BlotterReportStatus[] = ['rejected', 'done'];
const staffTransactionStatuses: BlotterReportStatus[] = ['pending', 'approved', 'processing'];
const staffHistoryStatuses: BlotterReportStatus[] = ['rejected', 'done'];

const transactionStatuses = computed<BlotterReportStatus[]>(() => {
  return isStaffView.value ? staffTransactionStatuses : residentTransactionStatuses;
});

const historyStatuses = computed<BlotterReportStatus[]>(() => {
  return isStaffView.value ? staffHistoryStatuses : residentHistoryStatuses;
});

const statusBadgeClass = (status: BlotterReportStatus) => {
  const mapping: Record<BlotterReportStatus, string> = {
    pending: 'bg-warning text-dark',
    processing: 'bg-info text-dark',
    approved: 'bg-primary',
    released: 'bg-success',
    done: 'bg-success',
    rejected: 'bg-danger',
    cancelled: 'bg-secondary',
  };
  return mapping[status] ?? 'bg-secondary';
};

const formatCaseId = (id: number) => `BR-${id.toString().padStart(5, '0')}`;

const truncatedDescription = (text?: string | null) => {
  if (!text) return 'No incident description provided.';
  if (text.length <= 140) return text;
  return `${text.substring(0, 140)}...`;
};

const fetchBlotterRecords = async (
  page: number = pagination.current,
  search?: string,
  explicitStatus?: BlotterReportStatus | null
) => {
  navigation.startNavigation();
  hasError.value = false;

  const activeStatus = explicitStatus ?? selectedStatusFilter.value;
  let statuses: BlotterReportStatus[] | null = null;

  if (activeStatus) {
    statuses = [activeStatus];
  } else {
    const pool = isHistoryScreen.value ? historyStatuses.value : transactionStatuses.value;
    statuses = pool.length ? pool : null;
  }

  const params: PageInfo = {
    page,
    per_page: pagination.perPage,
  };

  if (search) {
    params.search = search;
  }

  if (statuses && statuses.length) {
    params.statuses = statuses;
  }

  if (session.id && isResidentView.value) {
    params.user_id = session.id;
  }

  try {
    const response = isResidentView.value
      ? await fetchAllBlotterReportsById(params)
      : await fetchAllBlotterReports(params);

    if (response.status !== 'success') {
      throw response;
    }

    const paginator = response.data;
    blotterReports.value = paginator.data ?? [];
    pagination.current = paginator.current_page ?? 1;
    pagination.last = paginator.last_page ?? 1;
    pagination.total = paginator.total ?? blotterReports.value.length;
    pagination.links = paginator.links ?? [];
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    if (axiosError?.isAxiosError) {
      const responseData = axiosError.response?.data;
      errorMessage.value = responseData?.message ?? 'Failed to fetch blotter reports.';
    } else if (fallbackResponse?.message) {
      errorMessage.value = fallbackResponse.message;
    } else {
      errorMessage.value = 'Failed to fetch blotter reports.';
    }

    hasError.value = true;
  } finally {
    navigation.endNavigation();
  }
};

const fetchUserProfile = async () => {
  if (!isResidentView.value || !session.id) {
    return;
  }

  isLoadingProfile.value = true;
  profileErrorMessage.value = '';

  try {
    const response = await fetchSingleUserProfile(session.id.toString());

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

const handleBlockedNavigation = (event: Event) => {
  if (shouldBlockActions.value) {
    event.preventDefault();
  }
};

const handleSearch = () => {
  const trimmed = searchKeyword.value.trim();
  pagination.current = 1;
  fetchBlotterRecords(1, trimmed || undefined);
  searchKeyword.value = '';
};

const toggleHistoryView = () => {

  isHistoryScreen.value = !isHistoryScreen.value;
  selectedStatusFilter.value = null;
  pagination.current = 1;
  fetchBlotterRecords(pagination.current);
};

const handleStatusFilter = (status: BlotterReportStatus, checked: boolean) => {
  pagination.current = 1;
  selectedStatusFilter.value = checked ? status : null;
  fetchBlotterRecords(1, undefined, checked ? status : null);
};

const handlePageChange = (page: number) => {
  pagination.current = page;
  fetchBlotterRecords(page);
};

const createReportRoute = computed(() => {
  if (!session.id) return null;
  return {
    name: 'CreateBlotterReport',
    params: { role: props.role, id: session.id.toString() },
  };
});

onMounted(() => {
  fetchBlotterRecords();
  fetchUserProfile();
});
</script>

<template>
  <div class="my-5">
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4">
      <div>
        <p class="text-uppercase text-muted mb-1">My Reports</p>
        <h2 class="fw-bold mb-0">Blotter Report Overview</h2>
        <p class="text-secondary small mb-0">Track ongoing cases, follow their status, and stay informed.</p>
      </div>
      <div>
        <div class="d-flex align-items-center justify-content-end">
          <div class="text-md-end">
            <button class="btn btn-link text-decoration-none" type="button" @click="toggleHistoryView">
              {{ isHistoryScreen ? 'View Reports' : 'View History' }}
            </button>
          </div>
          <router-link v-if="isResidentView && createReportRoute" class="btn btn-primary mt-3 mt-lg-0"
            :class="{ disabled: shouldBlockActions }" :aria-disabled="shouldBlockActions"
            :tabindex="shouldBlockActions ? -1 : 0" :to="createReportRoute" @click="handleBlockedNavigation">
            <i class="bi bi-plus-circle me-2"></i> File New Report
          </router-link>
        </div>
        <p v-if="shouldBlockActions" class="fw-bold mt-2">
          <small class="text-danger">
            Please complete profile verification to file a blotter report.
          </small>
        </p>
      </div>
    </div>

    <WarningLabel :has-error="hasError" :errors="hasError ? [{ error: errorMessage }] : []" />

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <form class="row gy-3 align-items-center" @submit.prevent="handleSearch">
          <div class="col-md-6">
            <FormSearchInput v-model="searchKeyword" />
          </div>
          <div class="col-md-3 ms-auto">
            <button class="btn btn-outline-primary w-100" type="submit">
              Search
            </button>
          </div>

        </form>
        <hr />
        <div class="row gx-4 gy-2">
          <div class="col-md-6 col-lg-3" v-for="status in (isHistoryScreen ? historyStatuses : transactionStatuses)"
            :key="status">
            <FormCheckboxInput :id="`status-${status}`" :label="status.toUpperCase()"
              :model-value="selectedStatusFilter === status"
              @change="(checked: boolean) => handleStatusFilter(status, checked)" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="!blotterReports.length && !hasError" class="text-center py-5 bg-light rounded">
      <i class="bi bi-file-earmark-text display-4 text-muted"></i>
      <p class="mt-3 mb-1 fw-semibold">No blotter reports found.</p>
      <p class="text-secondary mb-3">File a new report or adjust your filters to see previous submissions.</p>
      <router-link v-if="isResidentView && createReportRoute" :to="createReportRoute" class="btn btn-primary"
        :class="{ disabled: shouldBlockActions }" :aria-disabled="shouldBlockActions"
        :tabindex="shouldBlockActions ? -1 : 0" @click="handleBlockedNavigation">
        File a Report
      </router-link>
    </div>

    <div class="row row-cols-1 row-cols-lg-2 g-4" v-else>
      <div class="col" v-for="report in blotterReports" :key="report.id">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start">
              <span class="badge rounded-pill px-3 py-2 text-uppercase" :class="statusBadgeClass(report.status)">
                {{ report.status }}
              </span>
              <small class="text-muted">{{ formatDateToHuman(report.created_at) || '—' }}</small>
            </div>
            <p class="text-muted text-uppercase fw-semibold small mt-2 mb-1">{{ report.incident_type }}</p>
            <h5 class="card-title text-dark">{{ report.incident_title || 'Untitled Incident' }}</h5>
            <p class="mb-2 text-secondary text-capitalize"><i class="bi bi-geo-alt me-2 text-primary"></i>{{
              report.location }}</p>
            <p class="card-text text-muted grow">
              {{ truncatedDescription(report.description) }}
            </p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div class="text-secondary small">
                <span class="fw-semibold">{{ formatCaseId(report.id) }}</span>
                <span class="mx-2">•</span>
                <span>{{ report.evidence?.length ?? 0 }} attachment(s)</span>
              </div>
              <router-link class="btn btn-sm btn-outline-primary"
                :to="{ name: 'ViewBlotterReport', params: { role: props.role, id: report.id.toString() } }">
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center mt-4" v-if="pagination.links.length > 1">
      <Pagination :links="pagination.links" :current-page="pagination.current" @change="handlePageChange" />
    </div>
  </div>
</template>

<style scoped>
.card-title {
  font-size: 1.1rem;
}
</style>
