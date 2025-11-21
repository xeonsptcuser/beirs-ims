<script setup lang="ts">
import { ref } from 'vue';
import { useCreateUserAccount } from '../Residents/composable/useCreateUserAccount';
import { useBlotterReports } from '../BlotterReports/composable/useBlotterReport';

defineProps<{ role: string }>();

const { addressOptions } = useCreateUserAccount()
const { incidentTypeOptions } = useBlotterReports()

// update this to be fetched from backend with this kind of format
const complaints = ref<Record<string, Record<string, number>>>({
  'sacred heart': {
    'Personal Conflicts / Misunderstandings': 1,
    'Theft (Petty)': 3,
    'Vandalism / Property Damage': 0,
    'Public Disturbance': 3
  },
  'Cenapro': {
    'Personal Conflicts / Misunderstandings': 1,
    'Theft (Petty)': 3,
    'Vandalism / Property Damage': 0,
    'Public Disturbance': 3
  },
  'hiland': {
    'Personal Conflicts / Misunderstandings': 1,
    'Theft (Petty)': 3,
    'Vandalism / Property Damage': 0,
    'Public Disturbance': 3
  },
  'mayol': {
    'Personal Conflicts / Misunderstandings': 1,
    'Theft (Petty)': 3,
    'Vandalism / Property Damage': 0,
    'Public Disturbance': 3
  },
  'perez': {
    'Personal Conflicts / Misunderstandings': 1,
    'Theft (Petty)': 3,
    'Vandalism / Property Damage': 0,
    'Public Disturbance': 3
  },
})

const getCount = (location: string, caseType: string): number | null => {
  return complaints.value[location]?.[caseType] || null
}
const getCellStyle = (location: string, caseType: string) => {

  const count = getCount(location, caseType) ?? 0
  const maxCount = 20 // adjust based on your data max value
  const intensity = Math.min(1, count / maxCount)
  const baseColor = '255, 165, 0' // Orange RGB

  return {
    backgroundColor: count ? `rgba(${baseColor}, ${intensity})` : '#b8b8b83f',
    color: count ? '#000' : '#999'
  }
}

// Tooltip content

const getTooltip = (location: string, caseType: string): string => {
  const count = getCount(location, caseType)
  if (!count) return ''
  return `Complaint\n${caseType}: ${count}`
}
</script>

<template>
  <div class="bg-white my-5 ">
    <div class="container-fluid py-4 ps-5 d-none d-md-block border rounded heatmap-container">
      <div class="d-flex align-items-center mb-2 heatmap-row">
        <div class="me-3 heatmap-location-label">&nbsp;</div>
        <div class="d-flex heatmap-cols">
          <div v-for="caseType in incidentTypeOptions" :key="caseType"
            class="text-center fw-bold align-middle p-1 mx-1 mb-1 heatmap-case-type" style="
              min-width: 75px;
              height: 80px; /* Adjust height to accommodate rotation */
              overflow: hidden;  /* Hide overflow if text is too long */
              position: relative;
            ">
            <span style="
            display: block;
            position:absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            text-align: center;
            white-space: normal;
            word-break: break-word;
            line-height: 1.1;
          ">
              {{ caseType }}
            </span>
          </div>
        </div>
      </div>
      <div v-for="location in addressOptions" class="d-flex align-items-center mb-1 heatmap-row" :key="location">
        <div class="me-3 heatmap-location-label text-capitalize"> {{ location }}</div>
        <div class="d-flex heatmap-cols">
          <div v-for="caseType in incidentTypeOptions" :key="caseType" class="mx-1 rounded text-center mb-2"
            :style="getCellStyle(location, caseType)" v-b-tooltip.hover :title="getTooltip(location, caseType)"
            style="min-width: 75px; height: 50px; line-height: 50px; cursor: pointer; ">
            {{ getCount(location, caseType) || '' }}
          </div>
        </div>
      </div>

    </div>
    <div class="d-flex d-md-none mobile-screen">
      <h3 class="text-center"> Heatmap Unavailable for Mobile Screen (future updates)...</h3>
    </div>
  </div>
</template>

<style>
.heatmap-container {
  overflow-x: auto;
}

.heatmap-row {
  min-width: max-content;
}

.heatmap-location-label {
  width: 120px;
  flex-shrink: 0;
  font-size: 0.9rem;
}

.heatmap-cols {
  flex-wrap: nowrap;
  flex: 1;
  min-width: max-content;
}

.heatmap-case-type span {
  font-size: 0.6rem;
}

.mobile-screen {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
