<script setup lang="ts">
import AppFooter from './AppFooter.vue';
import Appheader from './Appheader.vue';

</script>
<template>
  <Appheader></Appheader>
  <div class="container">
    <router-view></router-view>
  </div>
  <AppFooter />
</template>
