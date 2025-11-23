<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { ApiErrorResponse, CommonResponse, User } from '@/Types';
import type { AxiosError } from 'axios';
import { fetchSingleUserProfile } from '@/Utils/userServices';

const props = defineProps<{
  role: string;
  userId?: string;
}>();

const navItems = [
  {
    name: 'CreateBlotterReport',
    icon: 'bi-journals',
    title: 'File an Incident Report',
    description: 'Let the barangay know about incidents that need attention.',
    btnType: 'btn-outline-primary',
  },
  {
    name: 'CreateCertification',
    icon: 'bi-file-earmark-text',
    title: 'Request Certifications',
    description: 'Submit certificate requirements without visiting the hall.',
    btnType: 'btn-outline-success',
  },
];

const residentUser = ref<User | null>(null);
const isLoadingProfile = ref(false);
const profileErrorMessage = ref('');

const loadResidentProfile = async () => {
  if (!props.userId) {
    return;
  }

  profileErrorMessage.value = '';
  isLoadingProfile.value = true;
  try {
    const response = await fetchSingleUserProfile(props.userId);
    if (response.status !== 'success') {
      throw response;
    }
    residentUser.value = response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;
    profileErrorMessage.value =
      axiosError?.response?.data?.message ?? fallbackResponse?.message ?? 'Unable to load your profile.';
  } finally {
    isLoadingProfile.value = false;
  }
};

onMounted(() => {
  loadResidentProfile();
});

const isProfileIncomplete = computed(() => {
  const profile = residentUser.value?.profile;
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

const profileCompletionMessage = computed(() => {
  if (profileErrorMessage.value) {
    return profileErrorMessage.value;
  }
  if (shouldBlockActions.value) {
    return 'Update your contact number, home address, government identification and get verified by our admin to unlock all features.';
  }
  return 'Your profile is ready. Start by choosing an action below.';
});

</script>

<template>
  <div class="mb-5">
    <div class="row g-4 align-items-center mb-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">Resident Overview</p>
            <h4 class="fw-bold mb-2">
              {{ residentUser?.profile ? residentUser?.profile?.first_name + ' ' + (residentUser?.profile?.last_name ||
                '') : 'Welcome' }}
            </h4>
            <p class="text-secondary mb-3">{{ profileCompletionMessage }}</p>
            <router-link v-if="shouldBlockActions" class="btn btn-primary btn-sm"
              :to="{ name: 'UserProfile', params: { role: props.role, id: props.userId } }">
              Update My Profile
            </router-link>
            <div v-else class="badge bg-success-subtle text-success px-3 py-2 text-uppercase">
              Profile Verified
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">Quick Snapshot</p>
            <ul class="list-unstyled mb-0 text-secondary small">
              <li class="mb-2"><i class="bi bi-patch-check me-2 text-success"></i>Track certificate releases online.
              </li>
              <li class="mb-2"><i class="bi bi-bell me-2 text-primary"></i>Receive updates when statuses change.</li>
              <li><i class="bi bi-shield-check me-2 text-danger"></i>Reports stay private between you and the barangay.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-md-6" v-for="navItem of navItems" :key="navItem.name">
        <router-link :to="{ name: navItem.name, params: { role: props.role, id: props.userId } }"
          class="action-card btn d-flex flex-column gap-2 h-100"
          :class="[{ disabled: shouldBlockActions }, navItem.btnType]" :aria-disabled="shouldBlockActions"
          @click="handleBlockedNavigation">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-circle">
              <i class="bi" :class="navItem.icon"></i>
            </div>
            <div>
              <p class="fw-semibold mb-0">{{ navItem.title }}</p>
              <small>{{ navItem.description }}</small>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-card {
  border: 1px solid rgba(0, 0, 0, 0.075);
  border-radius: 1rem;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.08);
}

.action-card.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba(13, 110, 253, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
</style>
