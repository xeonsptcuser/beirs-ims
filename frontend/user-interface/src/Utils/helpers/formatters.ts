import type { IncidentType } from '@/Types'

export const formatDateToHuman = (dateIso: string) => {
  if (!dateIso) return

  return Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(
    new Date(dateIso)
  )
}

export const formatName = (firstName?: string, middleName?: string, lastName?: string) => {
  return `${firstName ?? ''} ${middleName ?? ''} ${lastName ?? ''} `
}

export const computeAge = (dateIsoStr: string) => {
  const age = Math.floor(
    (Date.now() - new Date(dateIsoStr).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  )

  if (Number.isNaN(age)) {
    return '-'
  }
  return age.toString()
}

export const dateToday = () => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const maxDate = () => {
  // Allow selecting today by not subtracting a day
  return dateToday()
}

export const orderedOptions = (optionsList: string[]) => {
  return [...optionsList].sort((a, b) => {
    return a.localeCompare(b)
  })
}

export const orderedOptionsIncidentType = (optionList: IncidentType[]) => {
  return [...optionList].sort((a, b) => {
    return a.id.localeCompare(b.id)
  })
}

export const addOrdinalSuffix = (num: string | number) => {
  if (typeof num === 'string') {
    num = Number.parseInt(num)
  }

  if (Number.isNaN(num)) return

  const j = num % 10
  const k = num % 100

  if (k === 11 || k === 12 || k === 13) {
    return num + 'th' // special teen-case
  }

  if (j === 1) return num + 'st'
  if (j === 2) return num + 'nd'
  if (j === 3) return num + 'rd'

  return num + 'th'
}
