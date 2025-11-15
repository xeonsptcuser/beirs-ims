<template>
  <div class="bg-white my-5">
    <div class="container py-4 ps-5 d-none d-md-block border rounded">
      <div class="d-flex align-items-center mb-2">
        <div class="me-3" style="width: 120px;">&nbsp;</div>
        <div class="d-flex flex-wrap" style="flex: 1; white-space: nowrap; overflow-x: hidden;">
          <div v-for="caseType in caseTypes" :key="caseType" class="text-center fw-bold align-middle p-1 mx-1 mb-1"
            style="
              min-width: 100px;
              height: 100px; /* Adjust height to accommodate rotation */
              overflow: hidden;  /* Hide overflow if text is too long */
              position: relative;
            ">
            <span style="
            display: block;
            position:absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            white-space: wrap; /* Ensures the rotated text doesn't break */
          ">
              {{ caseType }}
            </span>
          </div>
        </div>
      </div>
      <div v-for="location in locations" class="d-flex align-items-center mb-1">
        <div class="me-3" style="width: 120px;"> {{ location }}</div>
        <div class="d-flex flex-wrap" style="flex: 1;">
          <div v-for="caseType in caseTypes" :key="caseType" class="mx-1 rounded text-center mb-2"
            :style="getCellStyle(location, caseType)" v-b-tooltip.hover :title="getTooltip(location, caseType)"
            style="min-width: 100px; height: 60px; line-height: 60px; cursor: pointer; ">
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

<script setup lang="ts">
import { ref } from 'vue';

// ... (rest of the script remains unchanged)
defineProps<{ role: string }>();

const locations = ref([
  'Sitio 7',
  'Sitio 6',
  'Sitio 5',
  'Sitio 4',
  'Sitio 3',
  'Sitio 2',
  'Sitio 1',
])

const caseTypes = ref([
  'Verbal Altercation',
  'Threats',
  'Physical Injury',
  'Theft',
  'VAWC-Related Cases',
  'Public Nuisance',
  'Property Damage',
  'Trespassing',
  'Relationship Dispute',
  'Child-Related Incidents',
  'Brgy. Ordinance Violation',
  'Lost & Found',
  'Accidents',
  'Mediation Requests',
])

// update this to be fetched from backend with this kind of format
const complaints = ref<Record<string, Record<string, number>>>({
  'Sitio 7': {
    'Verbal Altercation': 1,
    Threats: 3,
    'Physical Injury': 0,
    Theft: 3
  },
  'Sitio 6': {
    'Verbal Altercation': 2,
    Threats: 1,
    Theft: 0
  },
  'Sitio 5': {
    'Verbal Altercation': 2,
    Threats: 1,
    'Public Nuisance': 5,
    Theft: 0
  },
  'Sitio 4': {
    'Verbal Altercation': 2,
    Threats: 1,
    'Public Nuisance': 5,
    Theft: 0
  },
  'Sitio 3': {
    'Verbal Altercation': 2,
    Threats: 1,
    'Public Nuisance': 5,
    Theft: 0
  },
})

const getCount = (location: string, caseType: string): number | null => {
  return complaints.value[location]?.[caseType] || null
}
const getCellStyle = (location: string, caseType: string) => {

  const count = getCount(location, caseType) ?? 0
  const maxCount = 15 // adjust based on your data max value
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

<style>
.mobile-screen {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
