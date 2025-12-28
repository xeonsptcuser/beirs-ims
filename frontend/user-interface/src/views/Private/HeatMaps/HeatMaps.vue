<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import brgyMap from '../../../assets/images/alang2-map.png'
import { useHeatMap } from './composable/useHeatMap';
import { orderedOptionsIncidentType } from '@/Utils/helpers/formatters';
import { useBlotterReports } from '../BlotterReports/composable/useBlotterReport';
import FormCheckboxInput from '@/components/common/FormCheckboxInput/FormCheckboxInput.vue';
import type { CaseType } from '@/Types';
import { useBarangayAddresses } from '@/composables/useBarangayAddresses';

const imageURL = brgyMap
const imageWidth = 1650
const imageHeight = 1500

const { initializeMap, drawHeatmap, fetchSections, isLoadingSections, sectionsError, sections } = useHeatMap();
const { incidentTypeOptions } = useBlotterReports();

// Address filter
const { addressOptions, loadBarangayAddresses, isLoadingAddresses } = useBarangayAddresses();
const selectedAddress = ref('');

// Year/month filter
const currentYear = new Date().getFullYear();
const years = computed(() => {
  const arr = [];
  for (let y = currentYear; y >= currentYear - 10; y--) arr.push(y);
  return arr;
});
const months = [
  { value: '', label: 'All' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
const selectedYear = ref('');
const selectedMonth = ref('');

const filterCollapsed = ref(true);

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



import { watch } from 'vue';

const fetchWithFilters = async () => {
  await fetchSections({
    address: selectedAddress.value,
    year: selectedYear.value,
    month: selectedMonth.value,
  });
  drawHeatmap(selectedIncidentTypes.value.length ? selectedIncidentTypes.value : 'total');
};

onMounted(async () => {
  initializeMap("map", imageURL, imageWidth, imageHeight);
  await loadBarangayAddresses();
  await fetchWithFilters();
});

watch([selectedAddress, selectedYear, selectedMonth], fetchWithFilters);

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
                  <div class="border bg-level-low legend-square"></div>
                  <div class="ms-2">
                    <p class="mb-0">Low</p>
                    <small class="text-muted">1 - 10 reports</small>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="border bg-level-medium legend-square"></div>
                  <div class="ms-2">
                    <p class="mb-0">Moderate</p>
                    <small class="text-muted">11 - 20 reports</small>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="border bg-level-high legend-square"></div>
                  <div class="ms-2">
                    <p class="mb-0">High</p>
                    <small class="text-muted">21+ reports</small>
                  </div>
                </div>
              </div>
            </section>
            <section style="margin-top: 3rem;" class="mb-4">
              <p class="h5 text-center">Filters</p>
              <hr class="col-9 mx-auto">
              <!-- Collapsible filter dropdown -->
              <div class="accordion col-12 mb-3" id="heatmapFilterAccordion">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingFilter">
                    <button class="accordion-button collapsed" type="button" :aria-expanded="!filterCollapsed"
                      aria-controls="collapseFilter" @click="filterCollapsed = !filterCollapsed">
                      <span class="fw-bold">Show Filters</span>
                    </button>
                  </h2>
                  <div :id="'collapseFilter'" class="accordion-collapse collapse" :class="{ show: !filterCollapsed }"
                    aria-labelledby="headingFilter" data-bs-parent="#heatmapFilterAccordion">
                    <div class="accordion-body">
                      <div class="mb-3">
                        <label for="sitioSelect" class="form-label">Sitio/Address</label>
                        <select id="sitioSelect" class="form-select text-capitalize" v-model="selectedAddress">
                          <option value="">All</option>
                          <option v-for="opt in addressOptions" :key="opt" :value="opt" class="text-capitalize">{{ opt
                          }}</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label for="yearSelect" class="form-label">Year</label>
                        <select id="yearSelect" class="form-select" v-model="selectedYear">
                          <option value="">All</option>
                          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label for="monthSelect" class="form-label">Month</label>
                        <select id="monthSelect" class="form-select" v-model="selectedMonth">
                          <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
                        </select>
                      </div>
                      <!-- Incident type checkboxes inside accordion -->
                      <div class="mb-3">
                        <label class="form-label">Case Types</label>
                        <ul class="list-group-flush">
                          <li class="list-group-item mb-1" v-for="(incidentType, index) in sortedIncidentTypeOptions">
                            <FormCheckboxInput :label="incidentType.label" :id="incidentType.id"
                              :model-value="selectedIncidentTypes.includes(incidentType.id as CaseType)"
                              @change="(isChecked) => setType(incidentType.id as CaseType, isChecked)" />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
  min-width: 34px;
  min-height: 34px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  border: 2px solid #ffffffaa;
  padding: 4px 6px;
  line-height: 1;
}

:global(.heatmap-pin__label) {
  font-size: 0.8rem;
  line-height: 1;
}

:global(.heatmap-pin__level) {
  font-size: 0.65rem;
  font-weight: 600;
  opacity: 0.9;
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

.legend-square {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}
</style>
