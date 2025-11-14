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
