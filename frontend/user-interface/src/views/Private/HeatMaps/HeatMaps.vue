<script setup lang="ts">
import { onMounted, ref } from 'vue';
import brgyMap from '../../../assets/images/alang2-map.png'
import { useHeatMap, type CaseType } from './composable/useHeatMap';

const imageURL = brgyMap
const imageWidth = 1650
const imageHeight = 1500

const { initializeMap, drawHeatmap, fetchSections, isLoadingSections, sectionsError } = useHeatMap();
const currentType = ref<CaseType>("total");

const setType = (type: CaseType) => {
  currentType.value = type;
  drawHeatmap(type);
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
        <div class="col-md-5 col-12 bg-white">
          Filters and legends show here
        </div>
        <div class="col-md-7 col-12">
          <div class="controls">
            <button @click="setType('total')">All</button>
            <button @click="setType('theft')">Theft</button>
            <button @click="setType('vandalism')">Vandalism</button>
            <button @click="setType('animal-related')">Animal-related</button>
            <button @click="setType('trespassing')">Trespassing</button>
          </div>

          <div class="status" v-if="isLoadingSections">Loading heatmap data...</div>
          <div class="status error" v-else-if="sectionsError">{{ sectionsError }}</div>
          <div id="map" style="height: 750px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.5rem;
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
</style>
