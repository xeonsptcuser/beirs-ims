import L from 'leaflet'
import { ref } from 'vue'
import type { Section } from '@/Types'
import { endpoints } from '@/services/api/endpoints'
import { HeatmapService } from '@/services/api/http/heatmap-service'
import { sections as localSections } from './heatmap-data'

export type CaseType =
  | 'personal-conflict'
  | 'noice-disturbance'
  | 'trespassing'
  | 'harrasment-threat'
  | 'physical-injury'
  | 'vandalism'
  | 'theft'
  | 'domestic-dispute'
  | 'animal-related'
  | 'curfew-violation'
  | 'public-disturbance'
  | 'lost-and-found'
  | 'brgy-service-complaint'
  | 'total'

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

  const getSectionExtents = (section: Section) => {
    const lats = section.coords.map(([lat]) => lat)
    const lngs = section.coords.map(([, lng]) => lng)

    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    return {
      latSpan: maxLat - minLat,
      lngSpan: maxLng - minLng,
      minLat,
      maxLat,
      minLng,
      maxLng,
    }
  }

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

  const seededRandom = (seed: string) => {
    let hash = 0
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash << 5) - hash + seed.charCodeAt(i)
      hash |= 0
    }

    const x = Math.sin(hash) * 10000
    return x - Math.floor(x)
  }

  const iconColors: Record<Exclude<CaseType, 'total'>, string> = {
    theft: '#e63946',
    vandalism: '#2a9d8f',
    'animal-related': '#f4a261',
    trespassing: '#457b9d',
    'personal-conflict': '#e63046',
    'noice-disturbance': '#f4a261',
    'harrasment-threat': '#457b9d',
    'physical-injury': '#e63046',
    'domestic-dispute': '#f4a261',
    'curfew-violation': '#457b9d',
    'public-disturbance': '#e63046',
    'lost-and-found': '#f4a261',
    'brgy-service-complaint': '#457b9d',
  }

  const iconOffsetRatios: Record<Exclude<CaseType, 'total'>, [number, number]> = {
    theft: [-0.45, -0.35],
    vandalism: [-0.2, 0.12],
    'animal-related': [0.05, 0.35],
    trespassing: [0.42, 0.08],
    'personal-conflict': [-0.32, 0.28],
    'noice-disturbance': [0.22, -0.28],
    'harrasment-threat': [0.3, 0.22],
    'physical-injury': [0.36, -0.36],
    'domestic-dispute': [-0.08, 0.32],
    'curfew-violation': [0.18, -0.32],
    'public-disturbance': [-0.28, -0.18],
    'lost-and-found': [0.18, 0.18],
    'brgy-service-complaint': [-0.18, 0.08],
  }

  const getIconOffset = (section: Section, type: Exclude<CaseType, 'total'>): [number, number] => {
    const { latSpan, lngSpan } = getSectionExtents(section)
    const [latRatio, lngRatio] = iconOffsetRatios[type]

    const safeLatSpan = latSpan || 1
    const safeLngSpan = lngSpan || 1
    const minSpan = Math.min(safeLatSpan, safeLngSpan)
    const scatterRadius = clamp(minSpan * 0.28, 10, 30)
    const jitterScale = scatterRadius * 0.2

    const jitterLat = (seededRandom(`${section.id}-${type}-lat`) - 0.5) * jitterScale
    const jitterLng = (seededRandom(`${section.id}-${type}-lng`) - 0.5) * jitterScale
    const baseLat = latRatio * scatterRadius
    const baseLng = lngRatio * scatterRadius

    const pushOut = scatterRadius * 0.25
    const baseMagnitude = Math.hypot(baseLat, baseLng) || 1

    const latOffset = clamp(
      baseLat + (baseLat / baseMagnitude) * pushOut + jitterLat,
      -safeLatSpan * 0.3,
      safeLatSpan * 0.3
    )
    const lngOffset = clamp(
      baseLng + (baseLng / baseMagnitude) * pushOut + jitterLng,
      -safeLngSpan * 0.3,
      safeLngSpan * 0.3
    )

    return [latOffset, lngOffset]
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
      type === 'total'
        ? [
            'personal-conflict',
            'noice-disturbance',
            'trespassing',
            'harrasment-threat',
            'physical-injury',
            'vandalism',
            'theft',
            'domestic-dispute',
            'animal-related',
            'curfew-violation',
            'public-disturbance',
            'lost-and-found',
            'brgy-service-complaint',
          ]
        : [type]

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

      const centroid = section.centroid ?? getPolygonCentroid(section.coords)

      for (const activeType of activeTypes) {
        const value = getSectionValue(section, activeType)
        if (!value) continue

        const { minLat, maxLat, minLng, maxLng, latSpan, lngSpan } = getSectionExtents(section)
        const [latOffset, lngOffset] = getIconOffset(section, activeType)

        const paddedLatMin = minLat + latSpan * 0.15
        const paddedLatMax = maxLat - latSpan * 0.15
        const paddedLngMin = minLng + lngSpan * 0.15
        const paddedLngMax = maxLng - lngSpan * 0.15

        const finalLat = clamp(centroid[0] + latOffset, paddedLatMin, paddedLatMax)
        const finalLng = clamp(centroid[1] + lngOffset, paddedLngMin, paddedLngMax)

        const marker = L.marker([finalLat, finalLng], {
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
