<script setup lang="ts">
import type { NavItem } from '@/Types';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import { computed } from 'vue';
import { Offcanvas } from 'bootstrap';

import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { useRouter } from 'vue-router';

defineProps({
  navLinks: {
    type: Array<NavItem>,
    required: true
  },
  title: {
    type: String,
    required: true,
    default: ''
  }
})

const useSession = useSessionStore();
const navigation = useGlobalLoadingStore();
const router = useRouter();

const navItems = [
  {
    name: 'Dashboard',
    label: 'Dashboard',
    roles: ['staff', 'resident', 'admin']
  },
  {
    name: 'Residents',
    label: 'Residents',
    roles: ['staff', 'admin']
  },
  {
    name: 'BlotterReports',
    label: 'Reports',
    roles: ['resident', 'staff', 'admin']
  },
  {
    name: 'Certifications',
    label: 'Certifications',
    roles: ['resident', 'staff', 'admin']
  },
  {
    name: 'HeatMaps',
    label: 'Heat-Map',
    roles: ['admin']
  },
  {
    name: 'ManageAddresses',
    label: 'Addresses',
    roles: ['admin']
  },
]

const filteredRoles = computed(() => {
  const role = useSession.role ?? 'resident'
  return navItems.filter(item => !item.roles?.length || item.roles.includes(role))
})

const truncateText = (text: string | null | undefined, limit = 25) => {
  const safeText = text ?? ''
  return safeText.length > limit ? `${safeText.slice(0, limit)}...` : safeText
}

const handleLogout = async () => {
  navigation.startNavigation();
  try {
    await useSession.logout();
    router.replace({ name: 'HomePage' });
  } catch (error) {
    console.error('Failed to logout user', error);
  } finally {
    navigation.endNavigation();
  }
}

const closeOffcanvas = () => {
  const element = document.getElementById('offcanvasScrolling');
  if (!element) return;
  const offcanvas = Offcanvas.getInstance(element) ?? new Offcanvas(element);
  offcanvas.hide();
};

const handleNavClick = () => {
  closeOffcanvas();
};

</script>
<template>

  <div class="offcanvas offcanvas-start" data-bs-scroll="true" id="offcanvasScrolling" data-bs-backdrop="false"
    tabindex="-1" aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header bg-primary-gradient">
      <h5 class="offcanvas-title text-center text-white" id="offcanvasScrollingLabel">{{ title }}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <ul class="list-group-flush ms-auto" v-if="!useSession.isLoggedIn()">
        <div class="d-md-flex gap-md-3 align-items-center pt-2">
          <li v-for="item in navLinks" :key="item.path" class="list-group-item">
            <router-link class="nav-link py-2 text-responsive" :to="item.path" @click="handleNavClick">
              {{ item.label }}
            </router-link>
          </li>
          <li class="list-group-item ms-md-5 mt-3 mt-md-0">
            <router-link class="nav-link text-responsive" to="/login" @click="handleNavClick">
              Login
            </router-link>
          </li>
        </div>
      </ul>
      <ul class="list-group-flush ms-auto" v-else>
        <div class="d-md-flex align-items-center pt-2 d-none">
          <li class="list-group-item px-2" v-for="navItem in filteredRoles">
            <router-link :to="{ name: `${navItem.name}`, params: { role: useSession.role } }"
              class="text-light text-decoration-none" @click="handleNavClick">
              {{ navItem.label }}
            </router-link>
          </li>
          <li class="list-group-item ps-2 me-3">
            <div class="dropdown">
              <a href="#" class="me-3 dropdown-toggle hidden-arrow text-light position-relative" id="notification"
                data-bs-toggle="dropdown" aria-expanded="true">
                <span class="position-absolute top-0 right-0 start-100 translate-middle badge rounded-pill bg-primary">
                  99
                  <span class="visually-hidden">unread messages</span>
                </span>
                <i class="bi bi-bell-fill fs-5"></i>
              </a>
              <!--
                Update the list of notifications
                things to show:
                  case_id: e.g BLRPT-001, CERT-001 small
                  record status e.g pending, approved etc...
                  message: e.g new update to your request
                  notification_status: read or unread

                behaviour:
                  should navigate to blotter reports view page on click
              -->
              <div class="dropdown-menu dropdown-menu-end notification-dropdown shadow border-0"
                aria-labelledby="notification">
                <div class="notification-dropdown__header border-bottom">
                  <span class="fw-semibold text-uppercase small text-muted">Notifications</span>
                  <a href="#" class="text-decoration-none small">Mark all as read</a>
                </div>
                <ul class="list-group list-group-flush notification-list" id="list">
                  <li class="list-group-item notification-item">
                    <a href="#list-item-1" class="notification-link">
                      <div class="notification-item__content">
                        <div>
                          <p class="notification-case mb-1 fw-bold">BR-XXXXXX-XXXXXX</p>
                          <p class="notification-message mb-1">
                            {{
                              truncateText(
                                'New update to your request with additional details that keep growing to exceed one'
                              )
                            }}
                          </p>
                          <small class="text-muted" style="font-size: 10px;"> Oct 06, 2025</small>
                        </div>
                        <span class="status-pill status-pill--approved">Approved</span>
                      </div>
                    </a>
                  </li>
                  <li class="list-group-item notification-item">
                    <a href="#list-item-2" class="notification-link">
                      <div class="notification-item__content">
                        <div>
                          <p class="notification-case mb-1">CASE ID: CERT-001</p>
                          <p class="notification-message mb-1">
                            {{
                              truncateText(
                                'Your certification request is pending review and we will notify you again '
                              )
                            }}
                          </p>
                          <small class="text-muted">Updated 3 mins ago</small>
                        </div>
                        <span class="status-pill status-pill--pending">Pending</span>
                      </div>
                    </a>
                  </li>
                  <li class="list-group-item notification-item">
                    <a href="#list-item-3" class="notification-link">
                      <div class="notification-item__content">
                        <div>
                          <p class="notification-case mb-1">CASE ID: BR-00231</p>
                          <p class="notification-message mb-1">
                            {{
                              truncateText(
                                'Investigating officer added a note about your blotter report involving the '
                              )
                            }}
                          </p>
                          <small class="text-muted">Updated yesterday</small>
                        </div>
                        <span class="status-pill status-pill--unread">Unread</span>
                      </div>
                    </a>
                  </li>
                </ul>
                <div class="notification-dropdown__footer border-top">
                  <a href="#" class="btn btn-sm btn-outline-primary w-100">View all updates</a>
                </div>
              </div>
            </div>
          </li>
          <li class="list-group-item ms-md-3 mt-3 mt-md-0">
            <div class="dropdown ">
              <a class="text-decoration-none text-md-dark dropdown-toggle" href="#" id="navProfileDesktop"
                data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle fs-1"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navProfileDesktop">
                <li class="pb-2 text-center">
                  <span class="text-md text-nowrap px-3">{{ useSession.name }}</span>
                </li>
                <li>
            <router-link :to="{ name: 'UserProfile', params: { role: useSession.role, id: useSession.id } }"
              class="dropdown-item" @click="handleNavClick"><i class="bi bi-person"></i> Profile
            </router-link>
          </li>
                <li><a class="dropdown-item disabled" href="#"><i class="bi bi-gear"></i> Settings</a></li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
                    <i class="bi bi-box-arrow-right"></i> Logout
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </div>
      </ul>
      <div class="d-md-none bg-light pe-3 py-2" v-if="useSession.isLoggedIn()">
        <ul class="list-group-flush">
          <li class="list-group-item py-2" v-for="navItem in filteredRoles">
            <router-link :to="{ name: `${navItem.name}`, params: { role: useSession.role } }"
              class="text-dark text-decoration-none" @click="handleNavClick">
              {{ navItem.label }}
            </router-link>
          </li>
          <li li class=" list-group-item py-2">
            <a class="text-md-dark text-decoration-none d-flex align-items-center justify-content-between"
              data-bs-toggle="collapse" href="#navbarMobileProfile" aria-expanded="false"
              aria-controls="navbarMobileProfile">
              {{ useSession.name }} <i class="bi bi-caret-down-fill"></i>
            </a>
            <div class="collapse mt-2 bg-white py-2" id="navbarMobileProfile">
              <ul class="list-group-flush ps-4">
                <li class="list-group-item bg-transparent border-0 mb-1">
                  <router-link :to="{ name: 'UserProfile', params: { role: useSession.role, id: useSession.id } }"
                    class="dropdown-item" @click="handleNavClick"><i class="bi bi-person"></i> Profile
                  </router-link>
                </li>
                <li class="list-group-item bg-transparent border-0 mb-1">
                  <a href="#" class="text-secondary text-decoration-none disabled"><i class="bi bi-gear"></i>
                    Settings</a>
                </li>
                <li class="list-group-item ">
                  <hr class="dropdown-divider bg-light" />
                </li>
                <li class="list-group-item bg-transparent border-0">
                  <a class="text-responsive text-decoration-none text-danger" href="#" @click.prevent="handleLogout">
                    <i class="bi bi-box-arrow-right"></i> Logout
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-md-dark {
  color: #333;
}

.text-sm {
  font-size: 12px;
}

@media (min-width: 768px) {
  .text-md-dark {
    color: #fff;
  }

  .text-md-dark:hover {
    color: #010101;
  }
}

.notification-dropdown {
  min-width: 22rem;
  padding: 0;
  border-radius: 1rem;
}

.notification-dropdown__header,
.notification-dropdown__footer {
  padding: 0.75rem 1rem;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notification-dropdown__footer {
  background-color: #fff;
}

.notification-list {
  max-height: 18rem;
  overflow-y: auto;
}

.notification-item {
  padding: 0;
}

.notification-link {
  display: block;
  padding: 0.9rem 1rem;
  text-decoration: none;
  color: inherit;
}

.notification-link:hover,
.notification-link:focus {
  background-color: rgba(0, 123, 255, 0.08);
}

.notification-item__content {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.notification-case {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  color: #0d6efd;
}

.notification-message {
  font-size: 0.9rem;
  text-wrap: nowrap;
  color: #444;
  display: -webkit-box;
  /* or block for single line */
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  /* remove and set white-space: nowrap for single line */
  -webkit-box-orient: vertical;
}

.status-pill {
  padding: 0.15rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  align-self: flex-start;
}

.status-pill--approved {
  background-color: #d1f5e1;
  color: #117a37;
}

.status-pill--pending {
  background-color: #fff4d7;
  color: #a86a09;
}

.status-pill--unread {
  background-color: #dfefff;
  color: #0b5ed7;
}
</style>
