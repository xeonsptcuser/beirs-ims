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

const formatAsDateInput = (date: Date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
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

export const isAgeWithinRange = (dateIsoStr: string, minAge = 18, maxAge = 110) => {
  const dob = new Date(dateIsoStr)
  if (Number.isNaN(dob.getTime())) {
    return false
  }

  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  const isBirthdayAheadThisYear = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())
  if (isBirthdayAheadThisYear) {
    age -= 1
  }

  return age >= minAge && age <= maxAge
}

export const isValidPhilippineMobile = (mobile: string) => {
  return /^09\d{9}$/.test(mobile.trim())
}

export const dateToday = () => {
  return formatAsDateInput(new Date())
}

export const maxBirthDate = (minAgeYears = 18) => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - minAgeYears)
  return formatAsDateInput(d)
}

export const minBirthDate = (maxAgeYears = 110) => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - maxAgeYears)
  return formatAsDateInput(d)
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
