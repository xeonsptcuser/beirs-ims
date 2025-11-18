<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { ApiErrorResponse, CommonResponse, User } from '@/Types';
import type { AxiosError } from 'axios';
import { fetchSingleUserProfile } from '@/Utils/userServices';

const props = defineProps<{
  role: string,
  userId?: string
}>()

const navItems = [
  {
    name: 'CreateBlotterReport',
    icon: 'bi-file-earmark-text',
    title: 'File Incident Report',
    btnType: 'btn-primary'
  },
  {
    name: 'CreateCertification',
    icon: 'bi-file-earmark',
    title: 'Request Certifications',
    btnType: 'btn-warning'
  },
]

const residentUser = ref<User | null>(null)
const isLoadingProfile = ref(false)
const profileErrorMessage = ref('')

const loadResidentProfile = async () => {
  if (!props.userId) {
    return
  }

  profileErrorMessage.value = ''
  isLoadingProfile.value = true
  try {
    const response = await fetchSingleUserProfile(props.userId)
    if (response.status !== 'success') {
      throw response
    }
    residentUser.value = response.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    const fallbackResponse = error as CommonResponse
    profileErrorMessage.value = axiosError?.response?.data?.message ?? fallbackResponse?.message ?? 'Unable to load your profile.'
  } finally {
    isLoadingProfile.value = false
  }
}

onMounted(() => {
  loadResidentProfile()
})

const isProfileIncomplete = computed(() => {
  const profile = residentUser.value?.profile
  if (!profile) {
    return false
  }

  const missingMobile = !profile.mobile_number || !profile.mobile_number.trim()
  const missingAddress = !profile.street_address || !profile.street_address.trim()
  return missingMobile || missingAddress
})

const shouldBlockActions = computed(() => isProfileIncomplete.value && !isLoadingProfile.value && !profileErrorMessage.value)

const handleBlockedNavigation = (event: Event) => {
  if (shouldBlockActions.value) {
    event.preventDefault()
  }
}

</script>
<template>
  <!-- FALLBACK DISPLAY  -->
  <div class="scrn-h-75 align-content-center">
    <div class=" align-items-center py-5">
      <div class="mb-4">
        <h1 class="font-bold letter-spacing-wide lh-base font-size-3">WELCOME TO BARANGAY ALANG-ALANG ELECTRONIC
          BLOTTER
          SYSTEM</h1>
      </div>
      <div class="mb-4" v-if="shouldBlockActions">
        <div class="alert alert-warning mb-3">
          <p class="mb-1 fw-bold">Complete your profile to continue</p>
          <p class="mb-2">Please update your phone number and street address before filing a blotter report or
            requesting a certificate.</p>
          <router-link class="alert-link" :to="{ name: 'UserProfile', params: { role, id: userId } }">
            Go to my profile
          </router-link>
        </div>
      </div>
      <div class="mb-4" v-else-if="profileErrorMessage">
        <div class="alert alert-danger mb-3">
          {{ profileErrorMessage }}
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-6" v-for="navItem of navItems">
          <router-link :to="{ name: navItem.name, params: { role: role, id: userId } }"
            class="btn py-4 w-100 action-btn"
            :class="[navItem.btnType, { 'mb-2': navItems.length > 1, disabled: shouldBlockActions }]"
            :aria-disabled="shouldBlockActions" @click="handleBlockedNavigation">
            <i class="bi fs-4 me-2" :class="[`${navItem.icon}`]"></i>
            <span> {{ navItem.title }} </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrn-h-75 {
  min-height: 75vh;
}

.letter-spacing-wide {
  letter-spacing: 0.15em;
}

.font-size-3 {
  font-size: 24px;
}

@media (min-width: 768px) {
  .font-size-3 {
    font-size: 42px;
  }
}
</style>
