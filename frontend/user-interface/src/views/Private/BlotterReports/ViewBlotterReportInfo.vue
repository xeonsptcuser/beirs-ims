<script setup lang="ts">
import SuccessLabel from '@/components/common/SuccessLabel/SuccessLabel.vue';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import { fetchBlotterReportInfo, updateBlotterReport } from '@/Utils/blotterReportServices';
import { formatDateToHuman } from '@/Utils/helpers/formatters';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import type {
  ApiErrorResponse,
  BlotterEvidence,
  BlotterReportResponse,
  BlotterReportStatus,
  CommonResponse
} from '@/Types';
import type { AxiosError } from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  role: string,
  id: string
}>();

const navigation = useGlobalLoadingStore();
const session = useSessionStore();
const router = useRouter();

const blotterReport = ref<BlotterReportResponse | null>(null);
const hasError = ref<boolean>(false);
const errorMessage = ref<string>('');
const successMessage = ref<string>('');
const previewEvidence = ref<BlotterEvidence | null>(null);

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');
const storageBaseUrl =
  (import.meta.env.VITE_STORAGE_URL as string | undefined) ||
  (apiBaseUrl ? `${apiBaseUrl}/storage` : '/storage');

const statusLabels: Record<BlotterReportStatus, string> = {
  pending: 'Pending Review',
  processing: 'Being Reviewed',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  released: 'Ready for Release',
  done: 'Completed',
};

const statusBadgeClass = (status?: BlotterReportStatus) => {
  if (!status) return 'bg-secondary';
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

const formatCaseId = (id?: number) => {
  if (!id && id !== 0) return 'N/A';
  return `BR-${id.toString().padStart(5, '0')}`;
};

const buildEvidenceUrl = (path: string) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedBase = storageBaseUrl.endsWith('/') ? storageBaseUrl.slice(0, -1) : storageBaseUrl;
  return `${normalizedBase}/${path}`.replace(/([^:]\/)\/+/g, '$1');
};

const actionButtonClass = (status: BlotterReportStatus) => {
  const outlineStatuses: BlotterReportStatus[] = ['cancelled', 'rejected'];
  const variantMap: Record<BlotterReportStatus, string> = {
    approved: 'primary',
    processing: 'primary',
    released: 'success',
    done: 'success',
    rejected: 'danger',
    cancelled: 'secondary',
    pending: 'primary',
  };
  const variant = variantMap[status] ?? 'primary';
  const isOutline = outlineStatuses.includes(status);
  return ['btn', 'mt-2', 'w-100', 'py-2', isOutline ? `btn-outline-${variant}` : `btn-${variant}`];
};

const isStaff = computed(() => session.isRoleStaff() || session.isRoleAdmin());
const isOwner = computed(() => blotterReport.value?.profile?.id === session.id);

const fetchReport = async () => {
  if (!props.id) return;

  navigation.startNavigation();
  hasError.value = false;
  successMessage.value = '';
  try {
    const response = await fetchBlotterReportInfo(props.id);
    blotterReport.value = response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    if (axiosError?.isAxiosError) {
      const responseData = axiosError.response?.data;
      errorMessage.value = responseData?.message ?? 'Failed to fetch blotter report.';
    } else if (fallbackResponse?.message) {
      errorMessage.value = fallbackResponse.message;
    } else {
      errorMessage.value = 'Failed to fetch blotter report.';
    }

    hasError.value = true;
  } finally {
    navigation.endNavigation();
  }
};

const previewBlotterReport = async () => {
  if (!blotterReport.value?.id) return;
  navigation.startNavigation();
  try {
    await router.push({
      name: 'BlotterPreview',
      params: {
        role: props.role,
        id: blotterReport.value.id,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    navigation.endNavigation();
  }
}

const statusActions = computed<BlotterReportStatus[]>(() => {
  const reportStatus = blotterReport.value?.status;
  if (!reportStatus) return [];

  const actions = new Set<BlotterReportStatus>();

  if (isStaff.value) {
    switch (reportStatus) {
      case 'pending':
      case 'processing':
        actions.add('approved');
        actions.add('rejected');
        break;
      case 'approved':
        actions.add('released');
        actions.add('cancelled');
        break;
      case 'released':
        actions.add('done');
        break;
      default:
        break;
    }
  }

  if (isOwner.value && reportStatus === 'pending') {
    actions.add('cancelled');
  }

  return Array.from(actions);
});

const handleStatusChange = async (status: BlotterReportStatus) => {
  if (!blotterReport.value) return;

  if (status === 'cancelled') {
    const confirmed = globalThis.confirm('Are you sure you want to cancel this report?');
    if (!confirmed) return;
  }

  navigation.startNavigation();
  hasError.value = false;
  errorMessage.value = '';

  try {
    const response = await updateBlotterReport(blotterReport.value.id.toString(), { status });
    if (response.status !== 'success') {
      throw response;
    }

    blotterReport.value = response.data;
    successMessage.value = `Status updated to ${statusLabels[status] || status}.`;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    if (axiosError?.isAxiosError) {
      const responseData = axiosError.response?.data;
      errorMessage.value = responseData?.message ?? 'Failed to update blotter report.';
    } else if (fallbackResponse?.message) {
      errorMessage.value = fallbackResponse.message;
    } else {
      errorMessage.value = 'Failed to update blotter report.';
    }
    hasError.value = true;
  } finally {
    navigation.endNavigation();
  }
};

const incidentDate = computed(() => {
  if (!blotterReport.value?.datetime_of_incident) return '';
  return formatDateToHuman(blotterReport.value.datetime_of_incident);
});

const incidentTime = computed(() => {
  if (!blotterReport.value?.datetime_of_incident) return '';
  return new Date(blotterReport.value.datetime_of_incident).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
});

const openEvidencePreview = (item: BlotterEvidence) => {
  previewEvidence.value = item;
};

const closeEvidencePreview = () => {
  previewEvidence.value = null;
};

const evidenceIsVideo = computed(() => previewEvidence.value?.mime_type?.startsWith('video/'));

const formattedPeopleInvolved = computed(() => {
  return (blotterReport.value?.person_involved ?? []).filter((person) => !!person?.trim());
});

const formattedWitnesses = computed(() => {
  return (blotterReport.value?.witnesses ?? []).filter((person) => !!person?.trim());
});

const showBlotterPreviewButton = computed(() => {
  return blotterReport.value?.status === 'approved' && isOwner.value && session.isRoleResident();
})

onMounted(fetchReport);

watch(() => props.id, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    fetchReport();
  }
});
</script>

<template>
  <div class="my-5">
    <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
      <div>
        <p class="text-uppercase text-muted mb-1">Case reference</p>
        <h2 class="fw-bold mb-0">{{ formatCaseId(blotterReport?.id) }}</h2>
        <p class="text-secondary mb-0">{{ blotterReport?.incident_title || 'Untitled blotter report' }}</p>
      </div>
      <div class="text-lg-end">
        <span class="badge px-3 py-2 text-uppercase" :class="statusBadgeClass(blotterReport?.status)">
          {{ blotterReport?.status }}
        </span>
        <p class="text-secondary small mt-2 mb-0">Filed on {{ formatDateToHuman(blotterReport?.created_at ?? '') || '—'
        }}</p>
      </div>
    </div>

    <WarningLabel :has-error="hasError" :errors="hasError ? [{ error: errorMessage }] : []" class="mb-3" />
    <SuccessLabel :is-success="!!successMessage" :message="successMessage" class="mb-3" />

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="card-title fw-semibold mb-3">Incident Details</h5>
            <div class="row g-3">
              <div class="col-md-6">
                <p class="text-muted mb-1 small">Case Type</p>
                <p class="fw-semibold mb-0 text-capitalize">{{ blotterReport?.incident_type || '—' }}</p>
              </div>
              <div class="col-md-3">
                <p class="text-muted mb-1 small">Date</p>
                <p class="fw-semibold mb-0">{{ incidentDate || '—' }}</p>
              </div>
              <div class="col-md-3">
                <p class="text-muted mb-1 small">Time</p>
                <p class="fw-semibold mb-0">{{ incidentTime || '—' }}</p>
              </div>
            </div>
            <div class="row g-3 mt-2">
              <div class="col-md-6">
                <p class="text-muted mb-1 small">Location</p>
                <p class="fw-semibold mb-0 text-capitalize">{{ blotterReport?.location || '—' }}</p>
              </div>
              <div class="col-md-6">
                <p class="text-muted mb-1 small">Landmark</p>
                <p class="fw-semibold mb-0">{{ blotterReport?.landmark || '—' }}</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-muted mb-1 small">Incident Description</p>
              <p class="mb-0 text-secondary lh-base">
                {{ blotterReport?.description || 'No description provided.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="card-title fw-semibold mb-3">People Involved</h5>
            <div class="row g-3">
              <div class="col-md-6">
                <p class="text-muted text-uppercase small mb-2">Individuals</p>
                <ul class="list-group list-group-flush text-capitalize">
                  <li class="list-group-item px-0 " v-for="(person, index) in formattedPeopleInvolved"
                    :key="`pi-${index}`">
                    <i class="bi bi-people me-2 text-primary"></i> {{ person }}
                  </li>
                  <li v-if="!formattedPeopleInvolved.length" class="list-group-item px-0 text-muted">
                    No additional individuals recorded.
                  </li>
                </ul>
              </div>
              <div class="col-md-6">
                <p class="text-muted text-uppercase small mb-2">Witnesses</p>
                <ul class="list-group list-group-flush text-capitalize">
                  <li class="list-group-item px-0" v-for="(person, index) in formattedWitnesses" :key="`wit-${index}`">
                    <i class="bi bi-eye me-2 text-success"></i> {{ person }}
                  </li>
                  <li v-if="!formattedWitnesses.length" class="list-group-item px-0 text-muted">
                    No witnesses recorded.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title fw-semibold mb-0">Evidence Attachments</h5>
              <span class="badge bg-light text-dark">{{ blotterReport?.evidence?.length ?? 0 }} file(s)</span>
            </div>
            <div class="list-group">
              <div v-for="item in blotterReport?.evidence" :key="item.id"
                class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <p class="mb-1 fw-semibold">{{ item.original_name }}</p>
                  <small class="text-muted text-uppercase">{{ item.mime_type }}</small>
                </div>
                <button class="btn btn-sm btn-outline-primary" type="button" @click="openEvidencePreview(item)">
                  View
                </button>
              </div>
              <div v-if="!blotterReport?.evidence?.length" class="text-muted">
                No files uploaded for this blotter report.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="card-title fw-semibold mb-3">Complainant Profile</h5>
            <div class="mb-3">
              <p class="text-muted small mb-1">Complainant</p>
              <p class="fw-semibold mb-0 text-capitalize">
                {{ blotterReport?.profile?.first_name }} {{ blotterReport?.profile?.middle_name }}
                {{ blotterReport?.profile?.last_name }}
              </p>
            </div>
            <div class="mb-3">
              <p class="text-muted small mb-1">Contact Number</p>
              <p class="fw-semibold mb-0">{{ blotterReport?.profile?.mobile_number || '—' }}</p>
            </div>
            <div class="mb-3">
              <p class="text-muted small mb-1">Address</p>
              <p class="fw-semibold mb-0 text-capitalize">
                {{ blotterReport?.profile?.street_address }}
                {{ blotterReport?.profile?.address_line ? ', ' + blotterReport?.profile?.address_line : '' }}
              </p>
            </div>
            <div>
              <p class="text-muted small mb-1">Assigned Handler</p>
              <p class="fw-semibold mb-0 text-capitalize">
                {{ blotterReport?.handler?.first_name ? `${blotterReport?.handler?.first_name}
                ${blotterReport?.handler?.last_name}` : 'Unassigned' }}
              </p>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="card-title fw-semibold mb-3">Status Timeline</h5>
            <ul class="list-unstyled mb-0 timeline">
              <li v-for="status in ['pending', 'processing', 'approved', 'released', 'done']" :key="status"
                :class="['timeline-item', { active: blotterReport?.status === status }]">
                <p class="mb-0 fw-semibold text-capitalize">{{ statusLabels[status as BlotterReportStatus] || status }}
                </p>
                <small class="text-muted">
                  <template v-if="blotterReport?.status === status">
                    Updated {{ formatDateToHuman(blotterReport?.updated_at ?? '') || '—' }}
                  </template>
                  <template v-else>
                    Pending
                  </template>
                </small>
              </li>
            </ul>
          </div>
        </div>

        <div class="card shadow-sm border-0" v-if="statusActions.length || showBlotterPreviewButton">
          <div class="card-body">
            <h5 class="card-title fw-semibold mb-3">Update Report Status</h5>
            <div class="d-flex flex-wrap gap-2">
              <button v-if="showBlotterPreviewButton" class="btn btn-outline-danger w-100" type="button"
                @click="previewBlotterReport">
                Preview PDF
              </button>
              <button v-else v-for="status in statusActions" :key="status" type="button"
                :class="actionButtonClass(status)" @click="() => handleStatusChange(status)">
                {{ statusLabels[status] || status }}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog v-if="previewEvidence" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="font-size: 16px;">{{ previewEvidence.original_name }}</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeEvidencePreview"></button>
          </div>
          <div class="modal-body text-center px-5">
            <img v-if="!evidenceIsVideo" :src="buildEvidenceUrl(previewEvidence.storage_path)" class="img-fluid rounded"
              alt="Evidence preview" />
            <video v-else class="w-100 rounded" controls>
              <source :src="buildEvidenceUrl(previewEvidence.storage_path)" :type="previewEvidence.mime_type" />
              Your browser does not support embedded videos.
            </video>
          </div>
          <div class="modal-footer">
            <a class="btn btn-outline-secondary" :href="buildEvidenceUrl(previewEvidence.storage_path)" target="_blank"
              rel="noopener">Open in new tab</a>
            <button class="btn btn-primary" type="button" @click="closeEvidencePreview">Close</button>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.timeline {
  border-left: 3px solid rgba(13, 110, 253, 0.2);
  padding-left: 1rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 1rem;
}

.timeline-item::before {
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ced4da;
  position: absolute;
  left: -1.56rem;
  top: 0.3rem;
}

.timeline-item.active::before {
  background: #0d6efd;
}

.modal-backdrop {
  z-index: 1040 !important;
}

.modal.show.d-block {
  z-index: 1050 !important;
}
</style>
