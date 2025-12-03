<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { fetchCertificateInfo, updateCertificateRequest } from '@/Utils/certificateServices';
import { computeAge, formatDateToHuman, formatName } from '@/Utils/helpers/formatters';
import { navigateToTopPage } from '@/Utils/helpers/common-helpers';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import SuccessLabel from '@/components/common/SuccessLabel/SuccessLabel.vue';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse, CertificateRequestsResponse, CommonResponse, StatusOptions, UpdateCertificateRequestPayload } from '@/Types';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';

const props = defineProps<{
  role: string,
  id: string
}>()

const navigation = useGlobalLoadingStore();
const router = useRouter();

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

const rejectionDialogVisible = ref(false);
const rejectionComment = ref('');
const rejectionError = ref('');

const closeRejectionDialog = () => {
  rejectionDialogVisible.value = false;
  rejectionError.value = '';
};

const openRejectionDialog = () => {
  rejectionComment.value = certificateInfo.value?.remarks || '';
  rejectionError.value = '';
  rejectionDialogVisible.value = true;
};

const handleApproveRejectReleaseCertRequest = async (status: StatusOptions, remarks?: string) => {
  if (status === 'cancelled') {
    const userConfirmed = globalThis.confirm('Are you sure you want to cancel request?');
    if (!userConfirmed) return;
  }

  navigation.startNavigation();
  hasError.value = false;
  errorMessage.value = '';
  try {
    // HANDLE CANCEL, APPROVE & REJECT FUNCTIONALITY HERE
    const requestPayload: UpdateCertificateRequestPayload = { status };
    if (remarks) {
      requestPayload.remarks = remarks;
    }

    const response = await updateCertificateRequest(certificateInfo.value?.id.toString() ?? '', requestPayload)

    if (response.status !== 'success') {
      throw response;
    }

    certificateInfo.value = response.data;

    if (status === 'approved') {
      hasApproval.value = true;
      successMessage.value = 'Certificate request has been approved!'
    }

    if (status === 'rejected') {
      hasRejection.value = true;
      successMessage.value = 'Certificate request has been rejected!'
      closeRejectionDialog();
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
    if (status === 'rejected') {
      rejectionError.value = errorMessage.value || 'Unable to reject this request right now.';
    }
  } finally {
    navigation.endNavigation();
  }
}

const previewCertificateRequest = async () => {
  if (!certificateInfo.value?.id) return;
  navigation.startNavigation();
  try {
    await router.push({
      name: 'CertificatePreview',
      params: {
        role: props.role,
        id: certificateInfo.value.id,
      },
      query: {
        certificateType: certificateInfo.value?.cert_request_type,
      },
    });
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
  const status = certificateInfo.value?.status;
  const allowedStatuses: StatusOptions[] = ['approved', 'released', 'done'];
  const hasAllowedStatus = status ? allowedStatuses.includes(status as StatusOptions) : false;

  if (!hasAllowedStatus) return false;

  if (useSession.isRoleStaff() || useSession.isRoleAdmin()) {
    return true;
  }

  return showIfCertificateRequestOwner.value;
})

const showReleaseButton = computed(() => {
  return isApproved.value && (useSession.isRoleStaff() || useSession.isRoleAdmin());
});

const showDoneButton = computed(() => {
  return isReleased.value && (useSession.isRoleStaff() || useSession.isRoleAdmin());
});

const staffRemarks = computed(() => certificateInfo.value?.remarks?.trim());

const submitRejectionComment = async () => {
  const trimmed = rejectionComment.value.trim();
  if (!trimmed) {
    rejectionError.value = 'Please add a short note before rejecting the request.';
    return;
  }

  await handleApproveRejectReleaseCertRequest('rejected', trimmed);
};

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
    <div class="mb-4">
      <button class="btn btn-outline-secondary btn-sm" type="button" @click="navigateToTopPage">
        <i class="bi bi-arrow-left me-2"></i>Back to list
      </button>
    </div>
    <div
      class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3">
      <div>
        <p class="text-muted text-uppercase small mb-1">Case Reference</p>
        <h2 class="fw-bold mb-1">{{ certificateCaseId }}</h2>
        <p class="text-secondary small mb-0 text-capitalize">
          {{ certificateInfo?.cert_request_type || 'Certificate Request' }}
        </p>
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

        <div class="card shadow-sm border-0 mb-4" v-if="staffRemarks">
          <div class="card-body d-flex gap-3 align-items-start">
            <div
              class="rounded-circle bg-light text-danger d-flex align-items-center justify-content-center flex-shrink-0"
              style="width: 46px; height: 46px;">
              <i class="bi bi-chat-dots-fill"></i>
            </div>
            <div>
              <p class="text-muted small mb-1">Staff/Admin Comment</p>
              <p class="mb-1 fw-semibold text-dark">{{ staffRemarks }}</p>
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
                @click="openRejectionDialog">Reject</button>
              <button v-if="showReleaseButton" class="btn btn-info w-100 text-white"
                @click="() => handleApproveRejectReleaseCertRequest('released')">Mark for Release</button>
              <button v-if="showDoneButton" class="btn btn-success w-100"
                @click="() => handleApproveRejectReleaseCertRequest('done')">Mark as Done</button>
              <button v-if="showCancelButton" class="btn btn-outline-secondary w-100"
                @click="() => handleApproveRejectReleaseCertRequest('cancelled')">Cancel Request</button>
              <button v-if="showPreviewButton" class="btn btn-outline-danger btn-sm" type="button"
                @click="previewCertificateRequest">
                Preview PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog v-if="rejectionDialogVisible" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="font-size: 16px;">Add a rejection comment</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeRejectionDialog"></button>
          </div>
          <div class="modal-body">
            <p class="text-secondary mb-2">Share a short note to let the resident know why this request is being
              rejected.
            </p>
            <textarea v-model="rejectionComment" class="form-control" rows="4"
              placeholder="Provide a clear reason for rejecting this certificate request"></textarea>
            <small v-if="rejectionError" class="text-danger d-block mt-2">{{ rejectionError }}</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="closeRejectionDialog">Cancel</button>
            <button type="button" class="btn btn-danger" @click="submitRejectionComment">
              Submit Comment & Reject
            </button>
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

dialog.modal.show.d-block {
  background: rgba(0, 0, 0, 0.25);
}
</style>
