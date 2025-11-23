<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import { fetchNotifications, markNotificationAsRead } from '@/Utils/notificationServices';
import type { UserNotification } from '@/Types';
import { formatDateToHuman } from '@/Utils/helpers/formatters';
import AppLogo from '../common/AppLogo/AppLogo.vue';
import HamburgerButton from '../common/HamburgerButton/HamburgerButton.vue';
import SlidingNavbar from '../common/SlidingNavbar/SlidingNavbar.vue';
import { useRouter } from 'vue-router';

const session = useSessionStore();
const router = useRouter();
const isLoggedIn = computed(() => session.isLoggedIn());
const navItems = computed(() => {
  if (!isLoggedIn.value) {
    return [
      { path: '/', label: 'Home' },
      { path: '/about', label: 'About' },
    ];
  }

  const role = session.role ?? 'resident';
  const buildPath = (segment: string) => `/${role}/${segment}`;

  if (session.isRoleAdmin()) {
    return [
      { path: buildPath('dashboard'), label: 'Dashboard' },
      { path: buildPath('residents'), label: 'Residents' },
      { path: buildPath('certifications'), label: 'Certificates' },
      { path: buildPath('blotter-reports'), label: 'Reports' },
      { path: buildPath('heat-maps'), label: 'Heat Map' },
      { path: buildPath('settings/addresses'), label: 'Addresses' },
    ];
  }

  if (session.isRoleStaff()) {
    return [
      { path: buildPath('dashboard'), label: 'Dashboard' },
      { path: buildPath('certifications'), label: 'Certificates' },
      { path: buildPath('blotter-reports'), label: 'Reports' },
      { path: buildPath('heat-maps'), label: 'Heat Map' },
    ];
  }

  return [
    { path: buildPath('dashboard'), label: 'Dashboard' },
    { path: buildPath('certifications'), label: 'Certificates' },
    { path: buildPath('blotter-reports'), label: 'Reports' },
  ];
});

const primaryActionRoute = computed(() => {
  if (!isLoggedIn.value) {
    return '/login';
  }
  const role = session.role ?? 'resident';
  return `/${role}/dashboard`;
});

const formatCaseId = (id: number, type: string) => {
  const isBlotter = type?.includes('BlotterReportStatusUpdated');
  const prefix = isBlotter ? 'BR' : 'CERT';
  const pad = isBlotter ? 5 : 4;
  return `${prefix}-${id.toString().padStart(pad, '0')}`;
};

const readStatus = (stringIso: string | null) => {
  if (!stringIso) {
    return 'Unread'
  }
  return 'read'
}

const primaryActionLabel = computed(() => (isLoggedIn.value ? 'Dashboard' : 'Login'));

const handleLogout = async () => {
  await session.logout();
  router.replace({ name: 'LoginPage' });
};

const notifications = ref<UserNotification[]>([]);
const isLoadingNotifications = ref(false);
const notificationError = ref('');
const showNotifications = ref(false);
const showUserMenu = ref(false);
const notificationDropdownRef = ref<HTMLElement | null>(null);
const userDropdownRef = ref<HTMLElement | null>(null);

const unreadCount = computed(() => notifications.value.filter((notification) => !notification.read_at).length);

const sortNotifications = (items: UserNotification[]) => {
  const byDateDesc = (a: UserNotification, b: UserNotification) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  const unread = items.filter((item) => !item.read_at).sort(byDateDesc);
  const read = items.filter((item) => !!item.read_at).sort(byDateDesc);
  return [...unread, ...read];
};

const loadNotifications = async () => {
  if (!isLoggedIn.value) {
    notifications.value = [];
    return;
  }
  isLoadingNotifications.value = true;
  notificationError.value = '';
  try {
    const fetched = await fetchNotifications();
    notifications.value = sortNotifications(fetched);
  } catch (error: any) {
    notificationError.value = error?.message ?? 'Failed to load notifications.';
  } finally {
    isLoadingNotifications.value = false;
  }
};

const handleMarkAsRead = async (notification: UserNotification) => {
  if (!notification || notification.read_at) {
    return;
  }

  try {
    await markNotificationAsRead(notification.id);
    const updated = notifications.value.map((item) =>
      item.id === notification.id ? { ...item, read_at: new Date().toISOString() } : item
    );
    notifications.value = sortNotifications(updated);
  } catch (error) {
    console.error('Failed to mark notification as read', error);
  }
};

const toggleNotifications = (event: MouseEvent) => {
  event.stopPropagation();
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value && !notifications.value.length) {
    loadNotifications();
  }
  if (showNotifications.value) {
    showUserMenu.value = false;
  }
};

const toggleUserMenu = (event: MouseEvent) => {
  event.stopPropagation();
  showUserMenu.value = !showUserMenu.value;
  if (showUserMenu.value) {
    showNotifications.value = false;
  }
};

const closeNotifications = () => {
  showNotifications.value = false;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as Node;
  if (notificationDropdownRef.value && !notificationDropdownRef.value.contains(target)) {
    closeNotifications();
  }
  if (userDropdownRef.value && !userDropdownRef.value.contains(target)) {
    closeUserMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  if (isLoggedIn.value) {
    loadNotifications();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});

watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    loadNotifications();
  } else {
    notifications.value = [];
    closeNotifications();
    closeUserMenu();
  }
});
</script>
<template>
  <header class="app-header text-white">
    <div class="top-bar py-1">
      <div class="container d-flex flex-wrap justify-content-between align-items-center small">
        <span><i class="bi bi-geo-alt-fill me-1"></i> Brgy. Alang-Alang, Mandaue City</span>
        <div class="d-flex flex-wrap gap-3">
          <span><i class="bi bi-telephone me-1"></i> +63 975 123 1234</span>
          <span><i class="bi bi-envelope me-1"></i> barangay@alang-alang.gov</span>
        </div>
      </div>
    </div>
    <nav class="navbar navbar-dark bg-primary-gradient py-3">
      <div class="container d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
          <AppLogo />
          <div class="d-none d-sm-block">
            <p class="mb-0 fw-bold text-uppercase small">BIERS-IMS</p>
            <small class="text-white-50">Community Information Portal</small>
          </div>
        </div>
        <div class="d-flex align-items-center gap-3">
          <div class="d-none d-lg-flex gap-3 align-items-center">
            <router-link v-for="item in navItems" :key="item.path"
              class="text-decoration-none nav-link-custom text-white-50" :to="item.path">
              {{ item.label }}
            </router-link>
            <div class="d-flex align-items-center gap-3" v-if="isLoggedIn">
              <div class="dropdown" ref="notificationDropdownRef" :class="{ show: showNotifications }">
                <button class="btn btn-outline-light btn-sm position-relative" type="button"
                  @click="toggleNotifications" v-if="session.isRoleResident()">
                  <i class="bi bi-bell"></i>
                  <span v-if="unreadCount"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {{ unreadCount }}
                  </span>
                </button>
                <div class="dropdown-menu dropdown-menu-end notification-dropdown" :class="{ show: showNotifications }">
                  <div
                    class="notification-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                    <div>
                      <p class="fw-semibold small mb-0 text-uppercase">Notifications</p>
                      <small class="text-muted">{{ unreadCount }} unread</small>
                    </div>
                    <button class="btn btn-link btn-sm text-decoration-none" type="button" @click="loadNotifications">
                      <i class="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>
                  <div class="notification-content">
                    <p v-if="notificationError" class="text-danger small px-3 py-2 mb-0">{{ notificationError }}</p>
                    <p v-else-if="isLoadingNotifications" class="text-muted small px-3 py-2 mb-0">
                      Loading notifications...
                    </p>
                    <ul v-else-if="notifications.length" class="list-group list-group-flush">
                      <li v-for="notification in notifications" :key="notification.id"
                        class="list-group-item d-flex justify-content-between align-items-start gap-3">
                        <router-link
                          :to="notification.type?.includes('BlotterReportStatusUpdated') ?
                            { name: 'ViewBlotterReport', params: { role: session.role, id: notification.data.certificate_id.toString() } } :
                            { name: 'ViewCertificateRequest', params: { role: session.role, id: notification.data.certificate_id.toString() } }"
                          class="me-2 w-100 text-decoration-none" @click="handleMarkAsRead(notification)">
                          <div class="d-flex align-items-center justify-content-between mb-1">
                            <span class="fw-semibold">
                              {{ formatCaseId(notification.data.certificate_id, notification.type) ?? 'Notification' }}
                            </span>
                            <span class="badge rounded-pill"
                              :class="notification.read_at ? 'bg-light text-dark' : 'bg-primary text-white'">
                              {{ readStatus(notification.read_at) }}
                            </span>
                          </div>
                          <p class="text-muted small mb-1">
                            {{ notification.data?.message ?? 'View details in your dashboard.' }}
                          </p>
                          <small class="text-muted">{{ formatDateToHuman(notification.created_at) || '' }}</small>
                        </router-link>
                      </li>
                    </ul>
                    <p v-else class="text-muted small px-3 py-2 mb-0">No notifications yet.</p>
                  </div>
                </div>
              </div>
              <div class="dropdown" ref="userDropdownRef" :class="{ show: showUserMenu }">
                <button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" @click="toggleUserMenu">
                  <i class="bi bi-person-circle me-1"></i> {{ session.name || 'Profile' }}
                </button>
                <ul class="dropdown-menu dropdown-menu-end" :class="{ show: showUserMenu }">
                  <li>
                    <router-link class="dropdown-item"
                      :to="{ name: 'UserProfile', params: { role: session.role, id: session.id } }"
                      @click="closeUserMenu">
                      <i class="bi bi-person me-2"></i> View Profile
                    </router-link>
                  </li>
                  <li>
                    <button class="dropdown-item" type="button" @click="() => { handleLogout(); closeUserMenu(); }">
                      <i class="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <router-link v-else class="btn btn-outline-light btn-sm d-none d-lg-inline-flex align-items-center gap-1"
              :to="primaryActionRoute">
              <i class="bi bi-box-arrow-in-right"></i>
              {{ primaryActionLabel }}
            </router-link>
          </div>
          <HamburgerButton class="d-lg-none" />
        </div>
      </div>
      <SlidingNavbar class="d-lg-none" :navLinks="navItems" title="Menu" />
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #0d6efd, #6610f2);
}

.top-bar {
  background-color: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

.nav-link-custom {
  transition: color 0.15s ease, border-bottom 0.15s ease;
  padding-bottom: 2px;
}

.nav-link-custom:hover,
.nav-link-custom.router-link-active {
  color: #fff;
  border-bottom: 2px solid rgba(255, 255, 255, 0.9);
}

.notification-dropdown {
  width: 320px;
  max-height: 360px;
  overflow: hidden;
}

.notification-content {
  max-height: 300px;
  overflow-y: auto;
}
</style>
