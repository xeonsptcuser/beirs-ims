<script setup lang="ts">
defineProps<{
  role: string
}>()

const navItems = [
  {
    name: 'CreateBlotterReport',
    icon: 'bi-file-earmark-text',
    title: 'File Blotter Report',
    btnType: 'btn-success'
  },
  {
    name: 'CreateBlotterReport',
    icon: 'bi-file-earmark',
    title: 'Request Certification',
    btnType: 'btn-warning'
  },
]

</script>
<template>
  <!-- FALLBACK DISPLAY  -->
  <div class="my-5">
    <div class="row align-items-center py-5">
      <div class="col-md-6 d-none d-md-block">
        <h1 class="font-bold">WELCOME TO BARANGAY ALANG-ALANG ELECTRONIC BLOTTER SYSTEM</h1>
      </div>
      <div class="col-12 col-md-6">
        <div class="d-flex justify-content-center " v-for="navItem of navItems">
          <router-link :to="{ name: navItem.name, params: { role: role } }" class="btn py-4 w-100"
            :class="[navItem.btnType, { 'mb-2': navItems.length > 1 }]">
            <i class="bi fs-4 me-2" :class="[`${navItem.icon}`]"></i>
            <span> {{ navItem.title }} </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
