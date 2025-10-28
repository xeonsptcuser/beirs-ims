<script setup lang="ts">
import BeirsLogo from '@/assets/images/beirs-logo.png'
</script>
<template>
  <nav class="navbar bg-primary-gradient">
    <div class="container d-flex align-items-center">
      <a href="#" class="d-flex text-decoration-none align-items-center">
        <img :src="BeirsLogo" alt="app-logo" height="65"></img>
       <div class="ms-2 d-flex flex-column">
        <p class="text-white fw-bold mb-0">BEIRS-IMS</p>
        <small class=" leading-5 text-white">Barangay E-Blotter and Incident Reporting System</small>
      </div>
      </a>
      <div class="pt-2">
        <ul class="list-group-flush">
          <li class="list-group-item"><i class="bi bi-telephone fs-6"></i> +63 975 123 1234</li>
          <li class="list-group-item"><i class="bi bi-envelope-at-fill fs-6"></i> sample@example.com </li>
          <li class="list-group-item"><i class="bi bi-facebook fs-6"></i> facebook.com/person1 </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
