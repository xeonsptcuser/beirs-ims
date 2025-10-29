<script setup lang="ts">
</script>
<template>
  <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling"
    aria-controls="offcanvasScrolling">
    <span class="navbar-toggler-icon"></span>
  </button>
</template>

<style scoped>
.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.5);
  /* optional: white border */
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255,255,255,1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

.navbar-toggler:hover {
  border-color: #fff;
}
</style>
