<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import brgyMap from '../../../assets/images/alang2-map.png'
import { useHeatMap, type HeatmapCaseType } from './composable/useHeatMap';
import { orderedOptions } from '@/Utils/helpers/formatters';
import { useBlotterReports } from '../BlotterReports/composable/useBlotterReport';
import FormCheckboxInput from '@/components/common/FormCheckboxInput/FormCheckboxInput.vue';

const imageURL = brgyMap
const imageWidth = 1650
const imageHeight = 1500

const { initializeMap, drawHeatmap, fetchSections, isLoadingSections, sectionsError } = useHeatMap();
const { incidentTypeOptions } = useBlotterReports();

const currentType = ref<HeatmapCaseType>("total");


const incidentTypes = computed(() => {
  return incidentTypeOptions.map(incidentType => incidentType.label)
})

const orderedIncidentType = computed(() => {
  return orderedOptions(incidentTypes.value)
})

const setType = (type: HeatmapCaseType) => {
  currentType.value = type
  drawHeatmap(currentType.value);
}

onMounted(async () => {
  initializeMap("map", imageURL, imageWidth, imageHeight);
  await fetchSections();
  drawHeatmap(currentType.value);
});

</script>

<template>
  <div class=" my-5 ">
    <div class="container">
      <div class="row my-2">
        <div class="col-md-7 col-12">
          <div class="status" v-if="isLoadingSections">Loading heatmap data...</div>
          <div class="status error" v-else-if="sectionsError">{{ sectionsError }}</div>
          <div id="map" style="height: 750px;"></div>
        </div>
        <div class="col-md-5 col-12 bg-white">
          <div class="px-3">
            <section class="mt-5">
              <p class="h5 text-center mb-4">Legends</p>
              <div class="d-flex align-items-center justify-content-between col-8 mx-auto">
                <div class="d-flex align-items-center">
                  <div class="border bg-level-low" style="width: 20px; height: 20px;"></div>
                  <p class="mb-0 ms-2">Low</p>
                </div>
                <div class="d-flex align-items-center">
                  <div class="border bg-level-medium" style="width: 20px; height: 20px;"></div>
                  <p class="mb-0 ms-2">Moderate</p>
                </div>
                <div class="d-flex align-items-center">
                  <div class="border bg-level-high" style="width: 20px; height: 20px;"></div>
                  <p class="mb-0 ms-2">High</p>
                </div>
              </div>
            </section>
            <section style="margin-top: 3rem;">
              <p class="h5 text-center">Filters</p>
              <hr class="col-9 mx-auto">
              <div class="row">
                <div class="mt-2">
                  <ul class="list-group-flush">
                    <li class="list-group-item mb-1" v-for="(incidentType, index) in orderedIncidentType">
                      <FormCheckboxInput :label="incidentType" :id="index.toString()" />
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status {
  padding: 0.5rem 0;
}

.status.error {
  color: #b22222;
}

:global(.heatmap-pin) {
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

:global(.heatmap-pin__body) {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
  border: 2px solid #ffffffaa;
}

:global(.heatmap-pin__label) {
  font-size: 0.75rem;
  line-height: 1;
}

:global(.heatmap-popup) {
  font-size: 0.95rem;
  line-height: 1.2;
}

:global(.heatmap-popup__meta) {
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.8rem;
  text-align: right;
}

.bg-level-low {
  background-color: rgb(255, 234, 2);
}

.bg-level-medium {
  background-color: rgb(255, 175, 2);
}

.bg-level-high {
  background-color: rgb(255, 91, 2);
}
</style>
