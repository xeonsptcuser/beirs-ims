<script setup lang="ts">
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import brgyMap from '@/assets/images/alang2-map.png'
import { useHeatMap, type CaseType } from './composable/useHeatMap';

const imageURL = new URL(brgyMap, import.meta.url).href;
const imageWidth = 1650;
const imageHeight = 1500;

const { initializeMap, drawHeatmap } = useHeatMap();
const currentType = ref<CaseType>("total");

const setType = (type: CaseType) => {
  currentType.value = type;
  drawHeatmap(type);
}

onMounted(() => {
  initializeMap("map", imageURL, imageWidth, imageHeight);
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
</style>
