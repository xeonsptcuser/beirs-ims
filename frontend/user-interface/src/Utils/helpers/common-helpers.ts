import router from '@/router'

export const evaluateStatus = (status: string) => {
  if (status === 'cancelled') {
    return 'bg-danger'
  }
  if (status === 'rejected') {
    return 'bg-warning text-dark'
  }
  if (status === 'approved') {
    return 'bg-primary'
  }
  if (status === 'released') {
    return 'bg-info'
  }
  if (status === 'done') {
    return 'bg-success'
  }
  return 'bg-secondary'
}

export const navigateToTopPage = () => {
  router.back()
}
