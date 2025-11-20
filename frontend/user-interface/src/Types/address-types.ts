export interface BarangayAddress {
  id: number
  name: string
  description?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BarangayAddressPayload {
  name: string
  description?: string | null
  is_active?: boolean
}
