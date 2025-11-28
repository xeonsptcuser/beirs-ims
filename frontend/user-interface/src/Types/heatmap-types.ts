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
  // counts of case types – in real app this comes from Laravel
  cases: Record<string, number>
}
