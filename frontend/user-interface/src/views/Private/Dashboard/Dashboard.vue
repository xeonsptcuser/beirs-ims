<script setup lang="ts">
import AdminDashboardImage from '@/assets/images/adminImageDashboard.png'

const props = defineProps<{ role: string }>();

</script>
<template>
  <div class="my-5">
    <div class="row align-items-center">
      <div class="col-md-7 col-sm-12">
        <p class="text-center letter-spacing-wide h2 mb-4">ADMIN PANEL</p>
        <div class="row justify-content-center gy-3 gx-3">
          <div class="col-12 col-md-6">
            <a href="#" class="btn btn-primary py-4 w-100">View Residents</a>
          </div>
          <div class="col-12 col-md-6">
            <a href="#" class="btn btn-warning py-4 w-100">Certification</a>
          </div>
          <div class="col-12 col-md-6">
            <a href="#" class="btn btn-success py-4 w-100">Blotter Reports</a>
          </div>
          <div class="col-12 col-md-6">
            <a href="#" class="btn btn-danger py-4 w-100">Heat Map</a>
          </div>
        </div>
      </div>
      <div class="col-md-5 d-none d-md-block ">
        <img :src="AdminDashboardImage" alt="admin-dashboard-img" class="img-fluid">
      </div>
    </div>
  </div>
</template>

<style scoped>
.letter-spacing-wide {
  letter-spacing: 12px;
}

@media (min-width: 768px) {
  .letter-spacing-wide {
    letter-spacing: 21px;

  }
}
</style>
