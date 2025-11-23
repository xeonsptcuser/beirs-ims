<script setup lang="ts">
const highlights = [
  "Guided steps that help residents submit complete, accurate reports without guesswork.",
  "Instant confirmation and status tracking to keep you informed from submission to resolution.",
  "Secure handling of personal data with role-based access for barangay officials.",
];

const pillars = [
  {
    icon: "bi-shield-check",
    title: "Trusted & Secure",
    description:
      "User authentication and controlled access ensure every report is handled with care and confidentiality.",
  },
  {
    icon: "bi-broadcast",
    title: "Always Connected",
    description:
      "Real-time updates and alerts keep residents, responders, and officials aligned on next steps.",
  },
  {
    icon: "bi-clipboard-data",
    title: "Insightful Records",
    description:
      "Streamlined history and analytics help the barangay spot trends and act quickly on community needs.",
  },
  {
    icon: "bi-emoji-smile",
    title: "Resident-Friendly",
    description:
      "Clear language, guided forms, and a mobile-ready layout make filing reports accessible to everyone.",
  },
];

const promises = [
  "Convenient online filing for incidents, certificates, and follow-ups—no long queues needed.",
  "Transparent progress updates with clear milestones so you always know what happens next.",
  "Responsive support from barangay staff focused on safety, accessibility, and efficient service.",
];
</script>

<template>
  <div class="about-wrapper py-5">
    <div class="container py-4">
      <div class="row align-items-center g-4 mb-5">
        <div class="col-lg-7">
          <p class="text-uppercase small fw-semibold text-primary mb-2">About the e-Blotter</p>
          <h1 class="fw-bold text-dark mb-3">A cleaner, faster way to serve our barangay</h1>
          <p class="text-muted mb-3">
            The Barangay Alang-Alang E-Blotter System modernizes incident reporting and certificate requests so residents can
            stay safe, informed, and connected. By combining guided forms, real-time updates, and secure records, we make it
            easier for everyone to work together for a safer community.
          </p>
          <div class="d-flex flex-wrap gap-2">
            <span class="badge bg-primary-subtle text-primary px-3 py-2">Community-first service</span>
            <span class="badge bg-light text-secondary px-3 py-2">Transparent progress</span>
            <span class="badge bg-light text-secondary px-3 py-2">Responsive support</span>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="card border-0 shadow-lg gradient-card h-100">
            <div class="card-body text-white">
              <h5 class="fw-bold mb-3">Why residents love it</h5>
              <ul class="list-unstyled mb-0 small">
                <li v-for="(item, index) in highlights" :key="index" class="d-flex gap-3 align-items-start mb-3">
                  <i class="bi bi-check-circle-fill fs-4"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div v-for="pillar in pillars" :key="pillar.title" class="col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="icon-circle bg-primary-subtle text-primary mb-3">
                <i :class="['bi', pillar.icon]"></i>
              </div>
              <h5 class="fw-semibold mb-2">{{ pillar.title }}</h5>
              <p class="text-muted small mb-0">{{ pillar.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-4 shadow-sm p-4">
        <div class="row g-4 align-items-center">
          <div class="col-lg-6">
            <h4 class="fw-bold text-dark mb-3">What you can expect</h4>
            <ul class="list-unstyled mb-0">
              <li v-for="(promise, i) in promises" :key="i" class="d-flex gap-3 align-items-start mb-3">
                <span class="badge bg-primary text-white rounded-pill mt-1">{{ i + 1 }}</span>
                <span class="text-muted">{{ promise }}</span>
              </li>
            </ul>
          </div>
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100 timeline-card">
              <div class="card-body">
                <p class="text-uppercase small fw-semibold text-primary mb-2">How it works</p>
                <h5 class="fw-bold text-dark mb-3">Simple steps from report to resolution</h5>
                <ol class="list-unstyled mb-0">
                  <li class="d-flex gap-3 align-items-start mb-3">
                    <div class="step-marker bg-primary text-white">1</div>
                    <div>
                      <h6 class="fw-semibold mb-1">Submit your report</h6>
                      <p class="text-muted small mb-0">Share details of incidents or service requests through guided forms.</p>
                    </div>
                  </li>
                  <li class="d-flex gap-3 align-items-start mb-3">
                    <div class="step-marker bg-primary-subtle text-primary">2</div>
                    <div>
                      <h6 class="fw-semibold mb-1">Track updates</h6>
                      <p class="text-muted small mb-0">Monitor progress, respond to follow-ups, and receive timely notifications.</p>
                    </div>
                  </li>
                  <li class="d-flex gap-3 align-items-start">
                    <div class="step-marker bg-light text-secondary">3</div>
                    <div>
                      <h6 class="fw-semibold mb-1">Get resolution</h6>
                      <p class="text-muted small mb-0">Access your history and final documents securely when your request is closed.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-wrapper {
  background: linear-gradient(135deg, #f8fbff, #e8f0ff);
}

.gradient-card {
  background: linear-gradient(135deg, #12243f, #1f3a63);
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.step-marker {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.timeline-card {
  border-radius: 18px;
}
</style>
