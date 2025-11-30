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

export type SectionId =
  | 'abbra'
  | 'liong'
  | 'mabolo'
  | 'perez'
  | 'pulang-bukid'
  | 'sacred-heart'
  | 'sapang-daan'
  | 'sudlon'
  | 'tinago'
  | 'tres-rosas'

export interface Section {
  id: SectionId
  name: string
  // polygon coordinates in [y, x] (lat, lng) for CRS.Simple
  coords: [number, number][]
  // optional custom centroid override in [y, x] (lat, lng) for CRS.Simple
  centroid?: [number, number]
  // counts of case types – in real app this comes from Laravel
  cases: Partial<Record<CaseType, number>>
}
