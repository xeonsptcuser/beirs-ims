export const formatDateToHuman = (dateIso: string) => {
  if (!dateIso) return

  return Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(
    new Date(dateIso)
  )
}

export const formatName = (firstName: string, middleName: string, lastName: string) => {
  return `${firstName} ${middleName} ${lastName} `
}
