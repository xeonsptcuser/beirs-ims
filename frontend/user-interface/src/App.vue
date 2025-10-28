<script lang="ts">
import { defineComponent } from "vue";
import state from './state';

export default defineComponent({
  name: 'App',
  setup() {
    return {
     state
    }
  },
});
</script>
 
<template>
  <div id="app-root">
    <router-view />
  </div>
</template>
