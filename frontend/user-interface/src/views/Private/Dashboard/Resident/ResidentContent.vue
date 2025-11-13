<script setup lang="ts">
defineProps<{
  role: string,
  userId?: string
}>()

const navItems = [
  {
    name: 'CreateBlotterReport',
    icon: 'bi-file-earmark-text',
    title: 'File Incident Report',
    btnType: 'btn-success'
  },
  {
    name: 'CreateCertification',
    icon: 'bi-file-earmark',
    title: 'Request Certifications',
    btnType: 'btn-warning'
  },
]

</script>
<template>
  <!-- FALLBACK DISPLAY  -->
  <div class="scrn-h-75 align-content-center">
    <div class=" align-items-center py-5">
      <div class="mb-4">
        <h1 class="font-bold letter-spacing-wide lh-base font-size-3">WELCOME TO BARANGAY ALANG-ALANG ELECTRONIC
          BLOTTER
          SYSTEM</h1>
      </div>
      <div class="row">
        <div class="col-12 col-md-6" v-for="navItem of navItems">
          <router-link :to="{ name: navItem.name, params: { role: role, id: userId } }" class="btn py-4 w-100"
            :class="[navItem.btnType, { 'mb-2': navItems.length > 1 }]">
            <i class="bi fs-4 me-2" :class="[`${navItem.icon}`]"></i>
            <span> {{ navItem.title }} </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrn-h-75 {
  min-height: 75vh;
}

.letter-spacing-wide {
  letter-spacing: 0.15em;
}

.font-size-3 {
  font-size: 24px;
}

@media (min-width: 768px) {
  .font-size-3 {
    font-size: 42px;
  }
}
</style>
