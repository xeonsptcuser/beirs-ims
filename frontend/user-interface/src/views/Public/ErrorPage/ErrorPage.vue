<script setup lang="ts"></script>
<template>
  <div class="not-found-container text-center my-5">
    <h1 class="display-4 fw-bold">404</h1>
    <p class="lead mb-4">The page you’re looking for doesn’t exist.</p>
    <router-link class="btn btn-primary" :to="{ name: 'HomePage' }">Back to Home</router-link>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
