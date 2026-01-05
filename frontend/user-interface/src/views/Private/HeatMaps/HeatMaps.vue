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

      <!-- Severity color descriptions -->
      <div class="severity-desc-block mt-3 mb-2">
        <div class="severity-desc-item">
          <span class="desc-dot desc-yellow"></span>
          <strong>Low Severity (Yellow):</strong> Corresponds mainly to 1-10 incidents. These are isolated and
          manageable through routine monitoring and standard barangay procedures.
        </div>
        <div class="severity-desc-item">
          <span class="desc-dot desc-orange"></span>
          <strong>Medium Severity (Orange):</strong> Often linked to 11-20 incidents or frequent minor cases.
          Indicates recurring patterns that require preventive actions, closer supervision, and early intervention.
        </div>
        <div class="severity-desc-item">
          <span class="desc-dot desc-red"></span>
          <strong>High Severity (Red):</strong> Dominated by 21 or more incidents, especially with significant or
          critical impact. Represents concentrated incident patterns requiring immediate attention, strategic
          planning, and possible coordination with law enforcement agencies.
        </div>
      </div>

      <!-- Severity Matrix Table (from image) -->
      <div class="severity-matrix-container mb-4">
        <table class="severity-matrix-table mx-auto">
          <thead>
            <tr>
              <th id="indicators">
                <div class="matrix-labels d-flex justify-content-between mt-2">
                  <span class="fw-bold">Impact ↓ / Frequency →</span>
                </div>
              </th>
              <th class="text-center" id="low">Low (1–10)</th>
              <th class="text-center" id="mid">Moderate (11–20)</th>
              <th class="text-center" id="high">High (21+)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="impact-label">Critical Impact</th>
              <td class="cell-brown">Rare but serious incidents, requires monitoring and preparedness planning.
              </td>
              <td class="cell-orange">Recurring serious incidents, needs urgent preventive measures and
                barangay-level coordination.</td>
              <td class="cell-red">Concentrated and severe incidents, demands immediate action, strategic
                intervention, and law enforcement coordination.</td>
            </tr>
            <tr>
              <th class="impact-label">Significant Impact</th>
              <td class="cell-yellow">Isolated cases with manageable effects, routine monitoring is sufficient.
              </td>
              <td class="cell-orange">Repeated incidents with noticeable impact, requires targeted prevention and
                closer supervision.</td>
              <td class="cell-red">Frequent incidents causing major disruption, priority allocation of resources
                and intensified response needed.</td>
            </tr>
            <tr>
              <th class="impact-label">Minor Impact</th>
              <td class="cell-yellow">Minimal impact and infrequent, maintain regular observation.</td>
              <td class="cell-yellow">Recurring minor issues, implement basic preventive actions.</td>
              <td class="cell-orange">Frequent minor incidents indicating emerging risk proactive barangay
                intervention recommended.</td>
            </tr>
          </tbody>
        </table>



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
  </div>
</template>

<style scoped>
.severity-desc-block {
  max-width: 100%;
  margin: 0.5rem auto 0 auto;
  font-size: 1.01rem;
  color: #222;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 1.1rem 1.5rem 1.1rem 1.5rem;
}

.severity-desc-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.severity-desc-item strong {
  min-width: 250px;
}

.desc-dot {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-right: 0.7em;
  margin-top: 0.22em;
  flex-shrink: 0;
  border: 2px solid #bbb;
}

.desc-yellow {
  background: #fff900;
}

.desc-orange {
  background: #ffb84d;
}

.desc-red {
  background: #ff2d1a;
}

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


.severity-matrix-outer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.2rem;
  margin-top: 1.2rem;
}

.matrix-labels-top {
  width: 100%;
  max-width: 900px;
  margin: 0 auto 0.5rem auto;
  font-size: 1.08rem;
  color: #222;
  text-align: left;
  padding-left: 2.5rem;
}

.severity-matrix-table {
  border-collapse: collapse;
  min-width: 900px;
  max-width: 98vw;
  font-size: 1.05rem;
  background: #fff;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}

.severity-matrix-table th,
.severity-matrix-table td {
  border: 1.5px solid #222;
  padding: 1.2rem 1.3rem;
  text-align: left;
  vertical-align: middle;
  font-size: 1.05rem;
}

.severity-matrix-table thead th {
  background: #f3f3f3;
  font-weight: 700;
  text-align: center;
  font-size: 1.13rem;
  padding: 0.7rem 1.3rem;
}

.severity-matrix-table .matrix-header {
  font-weight: 700;
  background: #f3f3f3;
  text-align: center;
}

.severity-matrix-table .matrix-corner {
  background: #fff;
  border: none;
  width: 2.5rem;
  min-width: 2.5rem;
}

.severity-matrix-table .impact-label {
  font-weight: 700;
  background: #fff;
  min-width: 250px;
  text-align: center;
  font-size: 1.08rem;
}

.severity-matrix-table .cell-yellow {
  background: #fff900;
  color: #222;
}

.severity-matrix-table .cell-orange {
  background: #ffb84d;
  color: #222;
}

.severity-matrix-table .cell-brown {
  background: #c97a1e;
  color: #fff;
}

.severity-matrix-table .cell-red {
  background: #ff2d1a;
  color: #fff;
}
</style>
