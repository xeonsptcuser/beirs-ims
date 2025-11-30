import L from 'leaflet'
import { ref } from 'vue'
import type { CaseType, Section } from '@/Types'
import { endpoints } from '@/services/api/endpoints'
import { HeatmapService } from '@/services/api/http/heatmap-service'
import { sections as localSections } from './heatmap-data'

export type { CaseType }

export type HeatmapCaseType = CaseType | 'total'

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
  const getSectionValue = (section: Section, type: HeatmapCaseType): number => {
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

  const iconColors: Record<CaseType, string> = {
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

  const typeOrder: CaseType[] = [
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

  const iconOffsetRatios = typeOrder.reduce<Record<CaseType, [number, number]>>(
    (acc, caseType, index) => {
      const angle = (index / typeOrder.length) * 2 * Math.PI
      acc[caseType] = [Math.sin(angle), Math.cos(angle)]
      return acc
    },
    {} as Record<CaseType, [number, number]>
  )

  const getIconOffset = (section: Section, type: CaseType): [number, number] => {
    const { latSpan, lngSpan } = getSectionExtents(section)
    const [latRatio, lngRatio] = iconOffsetRatios[type]
    const directionMagnitude = Math.hypot(latRatio, lngRatio) || 1
    const unitLat = latRatio / directionMagnitude
    const unitLng = lngRatio / directionMagnitude

    const safeLatSpan = latSpan || 1
    const safeLngSpan = lngSpan || 1
    const minSpan = Math.min(safeLatSpan, safeLngSpan)
    const scatterRadius = clamp(minSpan * 0.32, 12, 34)
    const jitterScale = scatterRadius * 0.25

    const radialJitter = (seededRandom(`${section.id}-${type}-radial`) - 0.5) * jitterScale
    const tangentialJitter = (seededRandom(`${section.id}-${type}-tangent`) - 0.5) * jitterScale * 0.6
    const baseDistance = scatterRadius + scatterRadius * 0.3 + radialJitter

    const latOffset = clamp(
      baseDistance * unitLat + tangentialJitter * -unitLng,
      -safeLatSpan * 0.35,
      safeLatSpan * 0.35
    )
    const lngOffset = clamp(
      baseDistance * unitLng + tangentialJitter * unitLat,
      -safeLngSpan * 0.35,
      safeLngSpan * 0.35
    )

    return [latOffset, lngOffset]
  }

  const buildMarkerIcon = (type: CaseType, value: number) =>
    L.divIcon({
      className: 'heatmap-pin',
      html: `<div class="heatmap-pin__body" style="background:${iconColors[type]}"><span class="heatmap-pin__label">${value}</span></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })

  // -----------------------------------------------------------------
  // 2. MAIN HEATMAP DRAWING FUNCTION
  // -----------------------------------------------------------------
  function drawHeatmap(type: HeatmapCaseType) {
    if (!map || !polygonLayerGroup || !markerLayerGroup) return
    if (!sections.value.length) return

    polygonLayerGroup.clearLayers()
    markerLayerGroup.clearLayers()

    const activeTypes: CaseType[] = type === 'total' ? [...typeOrder] : [type]

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

  const mergeSectionData = (remoteSections: Section[]): Section[] => {
    if (!remoteSections.length) {
      return [...localSections]
    }

    const remoteMap = remoteSections.reduce<Record<string, Section>>((acc, section) => {
      acc[section.id] = section
      return acc
    }, {})

    return localSections.map((section) => {
      const remote = remoteMap[section.id]

      if (!remote) {
        return section
      }

      return {
        ...section,
        name: remote.name ?? section.name,
        cases: { ...section.cases, ...(remote.cases ?? {}) },
      }
    })
  }

  const fetchSections = async () => {
    isLoadingSections.value = true
    sectionsError.value = null

    try {
      const response = await heatmapService.getSections(endpoints.GET_HEATMAP_SECTIONS)
      const remoteSections = response?.data ?? []
      sections.value = mergeSectionData(remoteSections)
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
