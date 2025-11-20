<script setup lang="ts">
import AdminDashboardImage from '@/assets/images/adminImageDashboard.png';

const props = defineProps<{ role: string }>();

const overviewHighlights = [
  {
    label: 'Resident Profiles',
    description: 'Review household data and keep records accurate.',
    icon: 'bi-people-fill',
    accent: 'text-primary',
  },
  {
    label: 'Certificate Requests',
    description: 'Monitor approvals and release completed documents.',
    icon: 'bi-file-earmark-text',
    accent: 'text-success',
  },
  {
    label: 'Blotter Reports',
    description: 'Track cases and assign handlers efficiently.',
    icon: 'bi-megaphone-fill',
    accent: 'text-danger',
  },
];

const quickActions = [
  {
    name: 'Residents',
    title: 'View Residents',
    description: 'Search, update, and manage barangay households.',
    icon: 'bi-house-door',
    buttonClass: 'btn-outline-primary',
  },
  {
    name: 'Certifications',
    title: 'Certification Requests',
    description: 'Approve or reject pending certificate requests.',
    icon: 'bi-journal-check',
    buttonClass: 'btn-outline-success',
  },
  {
    name: 'BlotterReports',
    title: 'Blotter Reports',
    description: 'Review reported incidents and status updates.',
    icon: 'bi-shield-exclamation',
    buttonClass: 'btn-outline-danger',
  },
  {
    name: 'HeatMaps',
    title: 'Heat Map',
    description: 'Visualize hotspots for quicker response planning.',
    icon: 'bi-geo-alt',
    buttonClass: 'btn-outline-warning',
  },
];
</script>

<template>
  <div class="mb-5">
    <div class="d-flex justify-content-between align-items-start align-items-lg-center flex-column flex-lg-row gap-3 mb-4">
      <div>
        <p class="text-muted text-uppercase small mb-1">Administration</p>
        <h2 class="fw-bold mb-1">Barangay Command Center</h2>
        <p class="text-secondary small mb-0">Monitor operations, respond to residents, and orchestrate services.</p>
      </div>
    </div>

    <div class="row g-4 mb-4 align-items-center">
      <div class="col-lg-5">
        <img :src="AdminDashboardImage" alt="Admin dashboard illustration" class="img-fluid rounded-4 shadow-sm" />
      </div>
      <div class="col-lg-7">
        <div class="row g-3">
          <div class="col-md-4" v-for="card in overviewHighlights" :key="card.label">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="icon-circle mb-3" :class="card.accent">
                  <i class="bi" :class="card.icon"></i>
                </div>
                <p class="fw-semibold mb-1">{{ card.label }}</p>
                <p class="text-muted small mb-0">{{ card.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <div>
            <h5 class="fw-bold mb-1">Quick Actions</h5>
            <p class="text-secondary mb-0">Jump straight into frequent administrative tasks.</p>
          </div>
        </div>
        <div class="row g-3">
          <div class="col-md-6" v-for="item in quickActions" :key="item.name">
            <div class="border rounded-4 p-4 d-flex flex-column gap-3 h-100">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-circle icon-circle-sm">
                  <i class="bi" :class="item.icon"></i>
                </div>
                <div>
                  <p class="fw-semibold mb-0">{{ item.title }}</p>
                  <small class="text-muted">{{ item.description }}</small>
                </div>
              </div>
              <router-link class="btn mt-auto" :class="item.buttonClass"
                :to="{ name: item.name, params: { role: props.role } }">
                Open Module
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(13, 110, 253, 0.08);
  font-size: 1.5rem;
}

.icon-circle-sm {
  width: 48px;
  height: 48px;
  background-color: rgba(13, 110, 253, 0.12);
}
</style>
