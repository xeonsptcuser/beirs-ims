export interface SuccessfulCreateUserResponse {
  status: string
  message: string
}

export interface PaginationLink {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

export interface PaginatedData<T> {
  current_page: number
  data: T
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: PaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface ApiResponse<T> {
  status: string
  message?: string
  data: T
}

export interface PageInfo {
  per_page: number
  page: number
}
