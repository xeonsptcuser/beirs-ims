<script setup lang="ts">
import { useSessionStore } from '@/Utils/store/useSessionStore';
import AdminContent from './Admin/AdminContent.vue';

defineProps<{
  role: string;
}>()
const isRoleAdmin = useSessionStore().isRoleAdmin();

</script>
<template>
  <AdminContent v-if="isRoleAdmin" :role />
  <!-- Add content for staff here -->
  <!-- Add content for resident here -->

  <!-- FALLBACK DISPLAY  -->
  <div class="my-5 py-5" v-else>
    <div class="alert alert-primary" role="alert">
      DASHBOARD PAGE HERE.... BAD ACCESS DISPLAY🎉
    </div>
  </div>
</template>
