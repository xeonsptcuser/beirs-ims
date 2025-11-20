<script setup lang="ts">
import BeirsLogo from '@/assets/images/alang2-seal.png'
import { useSessionStore } from '@/Utils/store/useSessionStore';

defineProps<{
  title?: string
}>()

const useSession = useSessionStore();
</script>
<template>
  <div v-if="useSession.isLoggedIn()">
    <router-link :to="{
      name: 'Dashboard',
      params: { role: useSession.role }
    }" class="d-flex text-decoration-none align-items-center">
      <img :src="BeirsLogo" alt="app-logo" height="65" class="rounded-circle" />
      <div class="d-none d-md-block ms-2 d-none d-md-inline" v-if="title">
        <p class="text-white fw-bold mb-0">{{ title }}</p>
      </div>
    </router-link>
  </div>
  <div v-else>
    <router-link to="/" class="d-flex text-decoration-none align-items-center">
      <img :src="BeirsLogo" alt="app-logo" height="65" class="rounded-circle" />
      <div class="d-none d-md-block ms-2 d-none d-md-inline" v-if="title">
        <p class="text-white fw-bold mb-0">{{ title }}</p>
        <small class=" leading-5 text-white">Barangay E-Blotter and Incident Reporting
          System</small>
      </div>
    </router-link>
  </div>
</template>
