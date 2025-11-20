<script setup lang="ts">
const props = defineProps<{ role: string }>();

const staffHighlights = [
  {
    label: 'Pending Reviews',
    description: 'Check certificates and blotter reports awaiting action.',
    icon: 'bi-inbox',
    accent: 'text-primary',
  },
  {
    label: 'Assignments',
    description: 'Coordinate with assigned residents and follow-ups.',
    icon: 'bi-person-workspace',
    accent: 'text-success',
  },
  {
    label: 'Notifications',
    description: 'Keep residents updated on status changes.',
    icon: 'bi-bell',
    accent: 'text-danger',
  },
];

const staffActions = [
  {
    name: 'Certifications',
    title: 'Review Certificate Requests',
    description: 'Approve, reject, or release certification documents.',
    icon: 'bi-file-check',
    buttonClass: 'btn-outline-primary',
  },
  {
    name: 'BlotterReports',
    title: 'Manage Blotter Reports',
    description: 'Update case statuses and communicate findings.',
    icon: 'bi-clipboard-data',
    buttonClass: 'btn-outline-success',
  },
];
</script>

<template>
  <div class="mb-5">
    <div class="row g-3 mb-4">
      <div class="col-md-4" v-for="highlight in staffHighlights" :key="highlight.label">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="icon-circle mb-3" :class="highlight.accent">
              <i class="bi" :class="highlight.icon"></i>
            </div>
            <p class="fw-semibold mb-1">{{ highlight.label }}</p>
            <p class="text-muted small mb-0">{{ highlight.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <div>
            <h5 class="fw-bold mb-1">Your Tasks</h5>
            <p class="text-secondary mb-0">Stay on top of assignments with quick links below.</p>
          </div>
        </div>
        <div class="row g-3">
          <div class="col-md-6" v-for="action in staffActions" :key="action.name">
            <div class="border rounded-4 p-4 d-flex flex-column gap-3 h-100">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-circle icon-circle-sm">
                  <i class="bi" :class="action.icon"></i>
                </div>
                <div>
                  <p class="fw-semibold mb-0">{{ action.title }}</p>
                  <small class="text-muted">{{ action.description }}</small>
                </div>
              </div>
              <router-link class="btn mt-auto" :class="action.buttonClass"
                :to="{ name: action.name, params: { role: props.role } }">
                Go to Module
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
  font-size: 1.4rem;
}

.icon-circle-sm {
  width: 48px;
  height: 48px;
  background-color: rgba(13, 110, 253, 0.12);
}
</style>
