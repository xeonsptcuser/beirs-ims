<script setup lang="ts">
import femaleStaff from "@/assets/images/girls-staff.png";

const features = [
  {
    title: "Incident Report Online Filing",
    items: [
      "Domestic disputes",
      "Public disturbances or altercations",
      "Traffic accidents",
      "Natural disasters and emergencies",
    ],
  },
  {
    title: "Certifications",
    items: ["Marriage", "Residency", "Clearance", "Indigency"],
  },
  {
    title: "Real-time Monitoring",
    items: ["Status Update", "SMS Notification"],
  },
  {
    title: "View Reports (For Official Use Only)",
    items: ["Heatmaps"],
  },
];
</script>

<template>
  <div class="container my-5 ">
    <div class="row align-items-start g-4">
      <!-- LEFT COLUMN: Illustration & Title -->
      <div class="col-md-6 col-12 text-center text-lg-start">
        <img :src="femaleStaff" alt="landing-img" class="img-fluid">
      </div>

      <!-- RIGHT COLUMN: Feature Cards -->
      <div class="col-md-6 col-12">
        <div class="mb-3 text-center">
          <h1 class="fw-bold mt-3">BLOTTER SYSTEM</h1>
          <h5 class="text-muted text-uppercase">Key Features</h5>
        </div>
        <hr class="mb-5">
        <div class="row g-3">
          <div class="col-sm-6" v-for="(feature, i) in features" :key="i">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-header bg-light fw-bold">
                {{ feature.title }}
              </div>
              <ul class="list-group list-group-flush small">
                <li class="list-group-item" v-for="(item, j) in feature.items" :key="j">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.card-header {
  color: #0f172a;
}
</style>
