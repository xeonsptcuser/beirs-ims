import L from 'leaflet'
import { ref } from 'vue'
import type { Section } from '@/Types'
import { endpoints } from '@/services/api/endpoints'
import { HeatmapService } from '@/services/api/http/heatmap-service'
import { sections as localSections } from './heatmap-data'

export type CaseType = 'theft' | 'vandalism' | 'trespassing' | 'animal-related' | 'total'

export function useHeatMap() {
  let map: L.Map | null = null
  let polygonLayerGroup: L.LayerGroup | null = null
  let markerLayerGroup: L.LayerGroup | null = null
  const sections = ref<Section[]>([...localSections])
  const isLoadingSections = ref(false)
  const sectionsError = ref<string | null>(null)

  const heatmapService = HeatmapService.getInstance()

  // -----------------------------------------------------------------
  // 1. UTILS – can always live outside Vue lifecycle
  // -----------------------------------------------------------------
  const getSectionValue = (section: Section, type: CaseType): number => {
    if (type === 'total') {
      return Object.values(section.cases).reduce((a, b) => a + b, 0)
    }
    return section.cases[type] ?? 0
  }

  const getPolygonCentroid = (coords: [number, number][]): [number, number] => {
    const total = coords.reduce(
      (acc, [lat, lng]) => {
        acc.lat += lat
        acc.lng += lng
        return acc
      },
      { lat: 0, lng: 0 }
    )

    return [total.lat / coords.length, total.lng / coords.length]
  }

  const iconColors: Record<Exclude<CaseType, 'total'>, string> = {
    theft: '#e63946',
    vandalism: '#2a9d8f',
    'animal-related': '#f4a261',
    trespassing: '#457b9d',
  }

  const iconOffsets: Record<Exclude<CaseType, 'total'>, [number, number]> = {
    theft: [10, 0],
    vandalism: [-10, 0],
    'animal-related': [0, 10],
    trespassing: [0, -10],
  }

  const buildMarkerIcon = (type: Exclude<CaseType, 'total'>, value: number) =>
    L.divIcon({
      className: 'heatmap-pin',
      html: `<div class="heatmap-pin__body" style="background:${iconColors[type]}"><span class="heatmap-pin__label">${value}</span></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })

  // -----------------------------------------------------------------
  // 2. MAIN HEATMAP DRAWING FUNCTION
  // -----------------------------------------------------------------
  function drawHeatmap(type: CaseType) {
    if (!map || !polygonLayerGroup || !markerLayerGroup) return
    if (!sections.value.length) return

    polygonLayerGroup.clearLayers()
    markerLayerGroup.clearLayers()

    const activeTypes: Exclude<CaseType, 'total'>[] =
      type === 'total' ? ['theft', 'vandalism', 'animal-related', 'trespassing'] : [type]

    for (const section of sections.value) {
      const polygon = L.polygon(section.coords, {
        color: '#000',
        weight: 1.5,
        dashArray: '6 4',
        fillColor: '#f2f2f2',
        fillOpacity: 0.35,
      })

      polygon.bindTooltip(section.name, { sticky: true })

      polygon.on('click', () => {
        console.log('Clicked section:', section.id)
        // You can emit Vue events or call props callbacks here
      })

      if (polygonLayerGroup) {
        polygon.addTo(polygonLayerGroup)
      }

      const centroid = getPolygonCentroid(section.coords)

      for (const activeType of activeTypes) {
        const value = getSectionValue(section, activeType)
        if (!value) continue

        const [latOffset, lngOffset] = iconOffsets[activeType]
        const marker = L.marker([centroid[0] + latOffset, centroid[1] + lngOffset], {
          icon: buildMarkerIcon(activeType, value),
        })

        marker.bindPopup(
          `<div class="heatmap-popup"><strong>${section.name}</strong><br/>${activeType}: ${value} case${value > 1 ? 's' : ''}<div class="heatmap-popup__meta">Updated data</div></div>`
        )

        marker.addTo(markerLayerGroup)
      }
    }
  }

  // -----------------------------------------------------------------
  // 3. INITIALIZE MAP (this is called from onMounted)
  // -----------------------------------------------------------------
  function initializeMap(elId: string, pngUrl: string, w: number, h: number) {
    map = L.map(elId, { crs: L.CRS.Simple, minZoom: -1 })

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [h, w],
    ]

    L.imageOverlay(pngUrl, bounds).addTo(map)
    map.fitBounds(bounds)

    map.on('click', (e: L.LeafletMouseEvent) => {
      console.log(e.latlng) // e.latlng.lat = y, e.latlng.lng = x in CRS.Simple
    })

    polygonLayerGroup = L.layerGroup().addTo(map)
    markerLayerGroup = L.layerGroup().addTo(map)
  }

  const fetchSections = async () => {
    isLoadingSections.value = true
    sectionsError.value = null

    try {
      const response = await heatmapService.getSections(endpoints.GET_HEATMAP_SECTIONS)
      const remoteSections = response?.data ?? []

      sections.value = remoteSections.length ? remoteSections : [...localSections]
    } catch (error) {
      console.error('Failed to load heatmap sections', error)
      sectionsError.value = 'Unable to load heatmap data. Showing local snapshot.'
      sections.value = [...localSections]
    } finally {
      isLoadingSections.value = false
    }
  }

  return {
    initializeMap,
    drawHeatmap,
    fetchSections,
    sections,
    isLoadingSections,
    sectionsError,
  }
}
