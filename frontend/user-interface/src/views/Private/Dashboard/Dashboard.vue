<script setup lang="ts">
import { useSessionStore } from '@/Utils/store/useSessionStore';
import AdminContent from './Admin/AdminContent.vue';
import ResidentContent from './Resident/ResidentContent.vue';

defineProps<{
  role: string;
}>()
const isRoleAdmin = useSessionStore().isRoleAdmin();
const isRoleResident = useSessionStore().isRoleResident();


</script>
<template>
  <AdminContent v-if="isRoleAdmin" :role />
  <ResidentContent v-if="isRoleResident" :role />
  <!-- Add content for staff here -->
  <!-- Add content for resident here -->

  <!-- FALLBACK DISPLAY  -->
  <div class="my-5 py-5" v-else>
    <div class="alert alert-primary" role="alert">
      DASHBOARD PAGE HERE.... BAD ACCESS DISPLAY🎉
    </div>
  </div>
</template>

<style scoped>
.letter-spacing-wide {
  letter-spacing: 12px;
}

@media (min-width: 768px) {
  .letter-spacing-wide {
    letter-spacing: 21px;

  }
}
</style>
