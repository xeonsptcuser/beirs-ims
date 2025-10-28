<script setup lang="ts">
import AppFooter from './AppFooter.vue';
import Appheader from './Appheader.vue';

</script>
<template>
  <div>
    <Appheader></Appheader>
    <router-view></router-view>
    <AppFooter />
  </div>
</template>
