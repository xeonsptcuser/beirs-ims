
<script setup lang="ts">
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
  <div class="container my-5 vh-100">
    <div class="row align-items-start g-4">
      <!-- LEFT COLUMN: Illustration & Title -->
      <div class="col-lg-6 text-center text-lg-start">
        <svg viewBox="0 0 240 280" role="img" class="img-fluid w-75">
          <title>Officer Illustration</title>
          <rect x="0" y="0" width="240" height="280" rx="24" fill="#f3f4f6" />
          <circle cx="120" cy="72" r="32" fill="#f2c6a9" />
          <rect x="76" y="112" width="88" height="88" rx="14" fill="#d4b48c" />
          <rect x="94" y="124" width="52" height="68" rx="6" fill="#5b6b8a" />
          <line x1="120" y1="42" x2="120" y2="28" stroke="#2f2f3a" stroke-width="4" />
          <circle cx="154" cy="64" r="3" fill="#2f2f3a" />
          <circle cx="86" cy="64" r="3" fill="#2f2f3a" />
        </svg>

        <h1 class="fw-bold mt-3">BLOTTER SYSTEM</h1>
        <h5 class="text-muted text-uppercase">Key Features</h5>
      </div>

      <!-- RIGHT COLUMN: Feature Cards -->
      <div class="col-lg-6">
        <div class="row g-3">
          <div class="col-sm-6" v-for="(feature, i) in features" :key="i">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-header bg-light fw-bold">
                {{ feature.title }}
              </div>
              <ul class="list-group list-group-flush small">
                <li
                  class="list-group-item"
                  v-for="(item, j) in feature.items"
                  :key="j"
                >
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
.container {
  background: radial-gradient(
      circle at 10% 80%,
      rgba(15, 23, 42, 0.06),
      transparent 60%
    ),
    #ffffff;
  border-radius: 10px;
  padding: 2rem;
}
.card-header {
  color: #0f172a;
}
</style>
