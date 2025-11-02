<script setup lang="ts">
import AppLogo from '../common/AppLogo/AppLogo.vue';
import HamburgerButton from '../common/HamburgerButton/HamburgerButton.vue';
import SlidingNavbar from '../common/SlidingNavbar/SlidingNavbar.vue';

const navItems = [
  {
    path: '/',
    label: 'Home'
  },
  {
    path: '/about',
    label: 'About'
  },
  {
    path: '/services',
    label: 'Services'
  },
]
</script>
<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary-gradient">
    <div class="container d-flex align-items-center justify-between">
      <AppLogo />
      <HamburgerButton />
      <SlidingNavbar :navLinks="navItems" title="Menu" />
    </div>
  </nav>
</template>
