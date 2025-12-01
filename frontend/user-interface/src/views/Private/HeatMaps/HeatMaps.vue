<script setup lang="ts">
import { onMounted, ref } from 'vue';
import brgyMap from '../../../assets/images/alang2-map.png'
import { useHeatMap } from './composable/useHeatMap';
import { orderedOptionsIncidentType } from '@/Utils/helpers/formatters';
import { useBlotterReports } from '../BlotterReports/composable/useBlotterReport';
import FormCheckboxInput from '@/components/common/FormCheckboxInput/FormCheckboxInput.vue';
import type { CaseType } from '@/Types';

const imageURL = brgyMap
const imageWidth = 1650
const imageHeight = 1500

const { initializeMap, drawHeatmap, fetchSections, isLoadingSections, sectionsError, sections } = useHeatMap();
const { incidentTypeOptions } = useBlotterReports();

const selectedIncidentTypes = ref<CaseType[]>([]);

const sortedIncidentTypeOptions = orderedOptionsIncidentType(incidentTypeOptions);

const downloadCsv = () => {
  const headers = ['Sitio', ...sortedIncidentTypeOptions.map((option) => option.label)];

  const sectionRows = sections.value.map((section) => [
    section.name,
    ...sortedIncidentTypeOptions.map((option) => section.cases?.[option.id as CaseType] ?? 0),
  ]);

  const totals = sortedIncidentTypeOptions.map((option) =>
    sections.value.reduce(
      (sum, section) => sum + (section.cases?.[option.id as CaseType] ?? 0),
      0,
    ),
  );

  const csvContent = [
    headers,
    ...sectionRows,
    ['Total', ...totals],
  ]
    .map((row) => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'heatmap-data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const setType = (type: CaseType, isChecked: boolean) => {
  const nextSelectedTypes = isChecked
    ? [...new Set([...selectedIncidentTypes.value, type])]
    : selectedIncidentTypes.value.filter((selectedType) => selectedType !== type)

  selectedIncidentTypes.value = nextSelectedTypes

  if (!nextSelectedTypes.length) {
    drawHeatmap('total')
    return
  }

  drawHeatmap(nextSelectedTypes)
}

onMounted(async () => {
  initializeMap("map", imageURL, imageWidth, imageHeight);
  await fetchSections();
  drawHeatmap('total');
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
            <section style="margin-top: 3rem;" class="mb-4">
              <p class="h5 text-center">Filters</p>
              <hr class="col-9 mx-auto">
              <div class="row">
                <div class="mt-2">
                  <ul class="list-group-flush">
                    <li class="list-group-item mb-1" v-for="(incidentType, index) in sortedIncidentTypeOptions">
                      <FormCheckboxInput :label="incidentType.label" :id="incidentType.id"
                        :model-value="selectedIncidentTypes.includes(incidentType.id as CaseType)"
                        @change="(isChecked) => setType(incidentType.id as CaseType, isChecked)" />
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            <div class="d-grid gap-2 col-9 mx-auto mb-3">
              <button class="btn btn-success" type="button" @click="downloadCsv"> <i
                  class="bi bi-file-earmark-spreadsheet"></i> Download CSV</button>
            </div>
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
