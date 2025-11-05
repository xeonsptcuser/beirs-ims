<script setup lang="ts">
import AdminDashboardImage from '@/assets/images/adminImageDashboard.png'

defineProps<{ role: string }>();

const ADMIN_PANEL = 'ADMIN PANEL';

const navItems = [
  {
    name: 'Residents',
    icon: 'bi-people-fill',
    title: 'View Residents',
    btnType: 'btn-primary'
  },
  {
    name: 'Certifications',
    icon: 'bi-files',
    title: 'Certification Requests',
    btnType: 'btn-warning'
  },
  {
    name: 'BlotterReports',
    icon: 'bi-megaphone-fill',
    title: 'Blotter Reports',
    btnType: 'btn-success'
  },
  {
    name: 'HeatMaps',
    icon: 'bi-broadcast-pin',
    title: 'Heat Map',
    btnType: 'btn-danger'
  },
]

// Fetch total records for

</script>
<template>
  <div class="my-5">
    <div class="row align-items-center py-5">
      <div class="col-md-5 d-none d-md-block">
        <img :src="AdminDashboardImage" alt="admin-dashboard-img" class="img-fluid">
      </div>
      <div class="col-md-7 col-sm-12">
        <p class="text-center letter-spacing-wide fw-bold h2 mb-4">{{ ADMIN_PANEL }}</p>
        <div class="row justify-content-center gy-3 gx-3">
          <div class="col-12 col-md-6" v-for="navItem in navItems">
            <router-link :to="{ name: navItem.name, params: { role: role } }"
              class="btn py-4 w-100 d-flex align-items-center justify-content-center" :class="[navItem.btnType]">
              <i class="bi fs-4 me-2" :class="[`${navItem.icon}`]"></i>
              <span> {{ navItem.title }} </span>
            </router-link>
          </div>
        </div>
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
