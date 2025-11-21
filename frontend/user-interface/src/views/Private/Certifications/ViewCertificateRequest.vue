<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { fetchCertificateInfo, updateCertificateRequest } from '@/Utils/certificateServices';
import { computeAge, formatDateToHuman, formatName } from '@/Utils/helpers/formatters';
import { navigateToTopPage } from '@/Utils/helpers/common-helpers';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import SuccessLabel from '@/components/common/SuccessLabel/SuccessLabel.vue';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse, CertificateRequestsResponse, CommonResponse, StatusOptions, UpdateCertificateRequestPayload } from '@/Types';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import { fetchOpenCertificatePreview } from '@/Utils/pdfServices';

const props = defineProps<{
  role: string,
  id: string
}>()

const navigation = useGlobalLoadingStore();

const certificateInfo = ref<CertificateRequestsResponse | null>()
const useSession = useSessionStore();

const hasApproval = ref<boolean>(false);
const hasRejection = ref<boolean>(false);
const hasReleasing = ref<boolean>(false);
const hasDone = ref<boolean>(false);

const successMessage = ref<string>('');

const hasError = ref<boolean>(false);
const errorMessage = ref<string>('');

const fetchCertificateRequestInfo = async () => {
  navigation.startNavigation()
  try {
    const response = await fetchCertificateInfo(props.id);
    certificateInfo.value = response.data;

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

const handleApproveRejectReleaseCertRequest = async (status: StatusOptions) => {
  if (status === 'cancelled') {
    const userConfirmed = globalThis.confirm('Are you sure you want to cancel request?');
    if (!userConfirmed) return;
  }

  navigation.startNavigation();
  try {
    // HANDLE CANCEL, APPROVE & REJECT FUNCTIONALITY HERE
    const requestPayload: UpdateCertificateRequestPayload = { status };

    const response = await updateCertificateRequest(certificateInfo.value?.id.toString() ?? '', requestPayload)

    if (response.status !== 'success') {
      throw response;
    }

    certificateInfo.value = response.data;

    globalThis.location.reload()

    if (status === 'approved') {
      hasApproval.value = true;
      successMessage.value = 'Certificate request has been approved!'
    }

    if (status === 'rejected') {
      hasRejection.value = true;
      successMessage.value = 'Certificate request has been rejected!'
    }

    if (status === 'released') {
      hasApproval.value = false
      hasReleasing.value = true;
      successMessage.value = 'Certificate request is ready for releasing!'
    }

    if (status === 'done') {
      hasApproval.value = false
      hasReleasing.value = false;
      hasDone.value = true;
      successMessage.value = 'Certificate request has been released!'
    }
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
    navigation.endNavigation();
  }
}

const showIfCertificateRequestOwner = computed(() => {
  return certificateInfo.value?.profile.id === useSession.id
})

const isApproved = computed(() => {
  return certificateInfo.value?.status === 'approved'
})

const isReleased = computed(() => {
  return certificateInfo.value?.status === 'released'
})

const isPending = computed(() => {
  return certificateInfo.value?.status === 'pending'
})

const showApproveRejectBtn = computed(() => {
  return isPending.value && !showIfCertificateRequestOwner.value && !useSession.isRoleResident()
})

const showCancelButton = computed(() => {
  return showIfCertificateRequestOwner.value && isPending.value
})

const showPreviewButton = computed(() => {
  return showIfCertificateRequestOwner.value && isApproved.value || isReleased.value
})

const showReleaseButton = computed(() => {
  return isApproved.value && (useSession.isRoleStaff() || useSession.isRoleAdmin());
});

const showDoneButton = computed(() => {
  return isReleased.value && (useSession.isRoleStaff() || useSession.isRoleAdmin());
});

const statusLabelMap: Record<StatusOptions, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  released: 'Ready for Release',
  done: 'Completed',
};

const statusBadgeClass = (status?: StatusOptions) => {
  if (!status) return 'bg-secondary';
  const mapping: Record<StatusOptions, string> = {
    pending: 'bg-warning text-dark',
    approved: 'bg-primary',
    rejected: 'bg-danger',
    cancelled: 'bg-secondary',
    released: 'bg-info text-dark',
    done: 'bg-success',
  };
  return mapping[status] ?? 'bg-secondary';
};

const certificateCaseId = computed(() => {
  const id = certificateInfo.value?.id;
  return id ? `CERT-${id.toString().padStart(4, '0')}` : 'CERT-—';
});

const applicantName = computed(() => {
  if (!certificateInfo.value) return 'Resident';
  const profile = certificateInfo.value.profile;
  return formatName(profile.first_name, profile.middle_name, profile.last_name);
});

const residencyRange = computed(() => {
  if (!certificateInfo.value) return '—';
  if (certificateInfo.value.is_current) {
    return `${formatDateToHuman(certificateInfo.value.start_residency_date ?? '') || '—'} - Present`;
  }
  const start = formatDateToHuman(certificateInfo.value.start_residency_date ?? '') || '—';
  const end = formatDateToHuman(certificateInfo.value.end_residency_date ?? '') || '—';
  return `${start} - ${end}`;
});

const handlerName = computed(() => {
  if (!certificateInfo.value?.handler) {
    return 'Awaiting assignment';
  }
  const handler = certificateInfo.value.handler;
  return formatName(handler.first_name, handler.middle_name, handler.last_name);
});

const handlerRole = computed(() => certificateInfo.value?.handler?.user?.role || '—');
const purposeText = computed(() => certificateInfo.value?.cert_request_reason || 'No stated purpose.');
const timelineStatuses: StatusOptions[] = ['pending', 'approved', 'released', 'done'];

onMounted(() => {
  fetchCertificateRequestInfo();
})

</script>
<template>
  <div class="my-5">
    <div
      class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3">
      <div>
        <p class="text-muted text-uppercase small mb-1">Case Reference</p>
        <h2 class="fw-bold mb-1">{{ certificateCaseId }}</h2>
        <p class="text-secondary small mb-0">{{ certificateInfo?.cert_request_type || 'Certificate Request' }}</p>
      </div>
      <div class="text-lg-end">
        <span class="badge px-3 py-2" :class="statusBadgeClass(certificateInfo?.status as StatusOptions)">
          {{ statusLabelMap[certificateInfo?.status as StatusOptions] || certificateInfo?.status }}
        </span>
        <p class="text-secondary small mt-2 mb-0">Filed on {{ formatDateToHuman(certificateInfo?.created_at ?? '') ||
          '—' }}</p>
      </div>
    </div>

    <div class="d-flex flex-column flex-lg-row gap-3 mb-3">
      <button class="btn btn-link text-decoration-none p-0" type="button" @click="navigateToTopPage">
        <i class="bi bi-arrow-left me-2"></i>Back to list
      </button>
      <div class="ms-auto d-flex flex-wrap gap-2">
        <SuccessLabel v-if="hasApproval" :is-success="hasApproval" :message="successMessage" alert-type="primary" />
        <SuccessLabel v-if="hasRejection" :is-success="hasRejection" :message="successMessage" alert-type="warning" />
        <SuccessLabel v-if="hasReleasing" :is-success="hasReleasing" :message="successMessage" alert-type="info" />
        <SuccessLabel v-if="hasDone" :is-success="hasDone" :message="successMessage" alert-type="success" />
      </div>
    </div>
    <WarningLabel :has-error="hasError" :errors="hasError ? [{ error: errorMessage }] : []" />

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="fw-semibold mb-3">Request Details</h5>
            <div class="row g-3">
              <div class="col-md-6">
                <p class="text-muted small mb-1">Applicant</p>
                <p class="fw-semibold mb-0">{{ applicantName }}</p>
                <small class="text-secondary">{{ computeAge(certificateInfo?.profile.date_of_birth ?? '') }} yrs</small>
              </div>
              <div class="col-md-6 text-capitalize">
                <p class="text-muted small mb-1">Address</p>
                <p class="fw-semibold mb-0">{{ certificateInfo?.profile.street_address || '—' }}</p>
                <small class="text-secondary">{{ certificateInfo?.profile.mobile_number || 'No contact info' }}</small>
              </div>
            </div>
            <div class="row g-3 mt-2">
              <div class="col-md-6">
                <p class="text-muted small mb-1">Residency</p>
                <p class="fw-semibold mb-0">{{ residencyRange }}</p>
              </div>
              <div class="col-md-6" v-if="certificateInfo?.handler">
                <p class="text-muted small mb-1">Assigned Handler</p>
                <p class="fw-semibold mb-0">{{ handlerName }}</p>
                <small class="text-secondary text-capitalize">{{ handlerRole }}</small>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-muted small mb-1">Purpose</p>
              <p class="text-secondary lh-base mb-0">{{ purposeText }}</p>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-body row g-3">
            <div class="col-md-6">
              <p class="text-muted small mb-1">Date Submitted</p>
              <p class="fw-semibold mb-0">{{ formatDateToHuman(certificateInfo?.created_at ?? '') || '—' }}</p>
            </div>
            <div class="col-md-6" v-if="certificateInfo?.handler">
              <p class="text-muted small mb-1">Last Updated</p>
              <p class="fw-semibold mb-0">{{ formatDateToHuman(certificateInfo?.updated_at ?? '') || '—' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="fw-semibold mb-3">Status Progress</h5>
            <ul class="list-unstyled timeline mb-0">
              <li v-for="status in timelineStatuses" :key="status"
                :class="['timeline-item', { active: certificateInfo?.status === status }]">
                <p class="mb-0 fw-semibold text-capitalize">{{ statusLabelMap[status] || status }}</p>
                <small class="text-muted">
                  <template v-if="certificateInfo?.status === status">
                    Updated {{ formatDateToHuman(certificateInfo?.updated_at ?? '') || '—' }}
                  </template>
                  <template v-else>
                    Pending
                  </template>
                </small>
              </li>
            </ul>
          </div>
        </div>

        <div class="card shadow-sm border-0 mb-4"
          v-if="showApproveRejectBtn || showCancelButton || showReleaseButton || showDoneButton || showPreviewButton">
          <div class="card-body">
            <h5 class="fw-semibold mb-3">Actions</h5>
            <div class="d-flex flex-column gap-2">
              <button v-if="showApproveRejectBtn" class="btn btn-primary w-100"
                @click="() => handleApproveRejectReleaseCertRequest('approved')">Approve</button>
              <button v-if="showApproveRejectBtn" class="btn btn-outline-danger w-100"
                @click="() => handleApproveRejectReleaseCertRequest('rejected')">Reject</button>
              <button v-if="showReleaseButton" class="btn btn-info w-100 text-white"
                @click="() => handleApproveRejectReleaseCertRequest('released')">Mark for Release</button>
              <button v-if="showDoneButton" class="btn btn-success w-100"
                @click="() => handleApproveRejectReleaseCertRequest('done')">Mark as Done</button>
              <button v-if="showCancelButton" class="btn btn-outline-secondary w-100"
                @click="() => handleApproveRejectReleaseCertRequest('cancelled')">Cancel Request</button>
              <button v-if="showPreviewButton" class="btn btn-outline-danger btn-sm" type="button"
                @click="fetchOpenCertificatePreview(certificateInfo?.id.toString() ?? '')">
                Preview PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  border-left: 3px solid rgba(13, 110, 253, 0.2);
  padding-left: 1rem;
  margin-bottom: 0;
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
  left: -1.55rem;
  top: 0.35rem;
}

.timeline-item.active::before {
  background: #0d6efd;
}
</style>
