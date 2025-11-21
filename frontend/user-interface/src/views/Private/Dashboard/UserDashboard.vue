<script setup lang="ts">
import { computed } from 'vue';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import AdminContent from './Admin/AdminContent.vue';
import ResidentContent from './Resident/ResidentContent.vue';
import StaffContent from './Staff/StaffContent.vue';

const props = defineProps<{
  role: string;
}>();

const session = useSessionStore();

const isAdmin = computed(() => session.isRoleAdmin());
const isResident = computed(() => session.isRoleResident());
const isStaff = computed(() => session.isRoleStaff());
const isLoggedIn = computed(() => session.isLoggedIn());

const welcomeTitle = computed(() => {
  if (isAdmin.value) return 'Administrative Control Center';
  if (isStaff.value) return 'Staff Operations Hub';
  if (isResident.value) return 'Resident Services Dashboard';
  return 'Barangay Services Portal';
});

const welcomeSubtitle = computed(() => {
  if (isAdmin.value) {
    return 'Monitor services, guide residents, and keep barangay operations running smoothly.';
  }
  if (isStaff.value) {
    return 'Review requests, coordinate with residents, and track assignments at a glance.';
  }
  if (isResident.value) {
    return 'Track your certificate and blotter requests, and stay updated with barangay announcements.';
  }
  return 'Sign in to access the barangay services tailored for you.';
});
</script>

<template>
  <div class="my-5">
    <div class="hero border rounded-4 p-4 p-lg-5 mb-4 shadow-sm">
      <p class="text-uppercase mb-1 small">Barangay Alang-alang</p>
      <h1 class="display-6 fw-bold mb-2 text-light">{{ welcomeTitle }}</h1>
      <p class="text-white-50 mb-0">{{ welcomeSubtitle }}</p>
    </div>

    <template v-if="isLoggedIn">
      <AdminContent v-if="isAdmin" :role="props.role" />
      <StaffContent v-else-if="isStaff" :role="props.role" />
      <ResidentContent v-else-if="isResident" :role="props.role" :user-id="session.id?.toString()" />
      <div v-else class="alert alert-info mt-4" role="alert">
        Hi {{ session.name || 'there' }}! We are preparing a dashboard experience for your role.
      </div>
    </template>

    <div v-else class="alert alert-primary mt-4" role="alert">
      Please sign in to access your dashboard.
    </div>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, #0d6efd, #6610f2);
  color: #fff;
  box-shadow: 0 1.5rem 2rem rgba(13, 110, 253, 0.25);
}
</style>
