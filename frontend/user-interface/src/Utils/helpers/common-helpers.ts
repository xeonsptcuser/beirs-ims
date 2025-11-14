import router from '@/router'

export const evaluateStatus = (status: string) => {
  if (status === 'cancelled') {
    return 'bg-danger'
  }
  if (status === 'rejected') {
    return 'bg-warning text-dark'
  }
  if (status === 'approved') {
    return 'bg-success'
  }
  return 'bg-secondary'
}

export const navigateToTopPage = () => {
  router.back()
}
