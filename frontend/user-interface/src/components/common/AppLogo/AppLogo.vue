<script setup lang="ts">
import BeirsLogo from '@/assets/images/beirs-logo.png'
import { useSessionStore } from '@/Utils/store/useSessionStore';

const useSession = useSessionStore();
</script>
<template>
  <a href="#" class="d-flex text-decoration-none align-items-center">
    <img :src="BeirsLogo" alt="app-logo" height="65" />
    <div class="d-none d-md-block ms-2 d-none d-md-inline">
      <p class="text-white fw-bold mb-0">BEIRS-IMS</p>
      <small class=" leading-5 text-white" v-if="!useSession.isLoggedIn()">Barangay E-Blotter and Incident Reporting
        System</small>
    </div>
  </a>
</template>
