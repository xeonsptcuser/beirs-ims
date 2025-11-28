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

  const computeMinMax = (type: CaseType) => {
    let min = Infinity
    let max = -Infinity

    for (const section of sections.value) {
      const v = getSectionValue(section, type)
      min = Math.min(min, v)
      max = Math.max(max, v)
    }

    if (min === max) max = min + 1 // avoid division by zero
    return { min, max }
  }

  const colorScale = (t: number): string => {
    // green → yellow → red
    const r = t < 0.5 ? Math.round(510 * t) : 255
    const g = t < 0.5 ? 255 : Math.round(510 * (1 - t))
    return `rgb(${r},${g},0)`
  }

  const valueToColor = (value: number, min: number, max: number) => {
    const t = (value - min) / (max - min)
    return colorScale(Math.min(1, Math.max(0, t)))
  }

  // -----------------------------------------------------------------
  // 2. MAIN HEATMAP DRAWING FUNCTION
  // -----------------------------------------------------------------
  function drawHeatmap(type: CaseType) {
    if (!map || !polygonLayerGroup) return
    if (!sections.value.length) return

    polygonLayerGroup.clearLayers()

    const { min, max } = computeMinMax(type)

    for (const section of sections.value) {
      const value = getSectionValue(section, type)
      const fill = valueToColor(value, min, max)

      const polygon = L.polygon(section.coords, {
        color: '#000',
        weight: 2,
        dashArray: '6 4',
        fillColor: fill,
        fillOpacity: 0.6,
      })

      polygon.bindTooltip(
        `${section.name}<br>${type === 'total' ? 'Total cases' : type}: ${value}`,
        { sticky: true }
      )

      polygon.on('click', () => {
        console.log('Clicked section:', section.id)
        // You can emit Vue events or call props callbacks here
      })

      if (polygonLayerGroup) {
        polygon.addTo(polygonLayerGroup)
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
