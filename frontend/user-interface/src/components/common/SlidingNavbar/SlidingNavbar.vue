<script setup lang="ts">
import type { NavItem } from '@/Types';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import { computed } from 'vue';

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
    roles: ['staff', 'admin']
  },
]

const filteredRoles = computed(() => {
  const role = useSession.role ?? 'resident'
  return navItems.filter(item => !item.roles?.length || item.roles.includes(role))
})

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

</script>
<template>

  <div class="offcanvas offcanvas-start" data-bs-scroll="true" id="offcanvasScrolling" data-bs-backdrop="true"
    tabindex="-1" aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header bg-primary-gradient">
      <h5 class="offcanvas-title text-center text-white" id="offcanvasScrollingLabel">{{ title }}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <ul class="list-group-flush ms-auto" v-if="!useSession.isLoggedIn()">
        <div class="d-md-flex gap-md-3 align-items-center pt-2">
          <li v-for="item in navLinks" :key="item.path" class="list-group-item">
            <router-link class="nav-link py-2 text-responsive" :to="item.path">{{ item.label }}</router-link>
          </li>
          <li class="list-group-item ms-md-5 mt-3 mt-md-0">
            <router-link class="nav-link text-responsive" to="/login">
              Login
            </router-link>
          </li>
        </div>
      </ul>
      <ul class="list-group-flush ms-auto" v-else>
        <div class="d-md-flex align-items-center pt-2 d-none">
          <li class="list-group-item px-2" v-for="navItem in filteredRoles">
            <router-link :to="{ name: `${navItem.name}`, params: { role: useSession.role } }"
              class="text-light text-decoration-none">
              {{ navItem.label }}
            </router-link>
          </li>
          <li class="list-group-item ps-2 me-3">
            <a href="#" class="text-light position-relative">
              <span class="position-absolute top-0 right-0 start-100 translate-middle badge rounded-pill bg-primary">
                99+
                <span class="visually-hidden">unread messages</span>
              </span>

              <i class="bi bi-bell-fill fs-5"></i></a>
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
                    class="dropdown-item"><i class="bi bi-person"></i> Profile
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
              class="text-dark text-decoration-none">
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
                    class="dropdown-item"><i class="bi bi-person"></i> Profile
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
</style>
