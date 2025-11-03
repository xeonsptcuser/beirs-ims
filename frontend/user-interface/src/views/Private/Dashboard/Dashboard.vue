<script setup lang="ts">
import { useSessionStore } from '@/Utils/store/useSessionStore';
import AdminContent from './Admin/AdminContent.vue';

defineProps<{
  role: string;
}>()
const useSession = useSessionStore();

</script>
<template>
  <AdminContent v-if="useSession.isRoleAdmin()" :role />

  <div class="my-5 py-5" v-else>
    <div class="alert alert-primary" role="alert">
      LANDING PAGE HERE.... 🎉sasa
    </div>
  </div>
</template>
