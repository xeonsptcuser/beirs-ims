<script setup lang="ts">
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import GlobalPageLoader from '../common/GlobalPageLoader/GlobalPageLoader.vue';
import AppFooter from './AppFooter.vue';
import Appheader from './Appheader.vue';
import { storeToRefs } from 'pinia';

const navigation = useGlobalLoadingStore();
const { isNavigating } = storeToRefs(navigation)
</script>
<template>
  <Appheader></Appheader>
  <div class="container">
    <router-view></router-view>
  </div>
  <AppFooter />
  <GlobalPageLoader v-if="isNavigating" />

</template>
