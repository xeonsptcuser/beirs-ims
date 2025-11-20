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
  <div class="landing-wrapper py-5">
    <div class="container py-5">
      <div class="row align-items-center g-5 mb-5">
        <div class="col-lg-6 ps-5">
          <p class="text-uppercase small fw-semibold text-primary mb-2">Welcome to Barangay Alang-Alang</p>
          <h1 class="display-5 fw-bold text-dark mb-3">Your Digital Desk for Barangay Services</h1>
          <p class="text-muted mb-4">
            File incident reports, request certificates, and stay informed without leaving your home. We're making
            barangay services convenient, transparent, and resident-friendly.
          </p>
          <div class="d-flex gap-3 flex-wrap">
            <router-link to="/login" class="btn btn-primary btn-lg px-4">Login</router-link>
            <router-link to="/registration" class="btn btn-outline-secondary btn-lg px-4">Register</router-link>
          </div>
        </div>
        <div class="col-lg-6 text-center">
          <img :src="femaleStaff" alt="landing-img" class="img-fluid hero-illustration" />
        </div>
      </div>
      <div class="bg-white rounded-4 shadow-sm p-4">
        <div class="mb-4 text-center">
          <h2 class="fw-bold mb-2">What you can do</h2>
          <p class="text-muted mb-0">Everything you need to stay connected with your barangay.</p>
        </div>
        <div class="row g-3">
          <div class="col-sm-6 col-lg-3" v-for="(feature, i) in features" :key="i">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-header bg-light fw-bold text-primary">
                {{ feature.title }}
              </div>
              <ul class="list-group list-group-flush small">
                <li class="list-group-item" v-for="(item, j) in feature.items" :key="j">
                  <i class="bi bi-check-circle text-primary me-2"></i>{{ item }}
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
.landing-wrapper {
  background: linear-gradient(135deg, #f8fbff, #e8f0ff);
}

.hero-illustration {
  max-width: 480px;
  width: 100%;
}

.card-header {
  color: #0f172a;
}
</style>
