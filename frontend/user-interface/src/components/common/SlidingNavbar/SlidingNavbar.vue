<script setup lang="ts">
import type { NavItem } from '@/Types';
import { useSessionStore } from '@/Utils/store/useSessionStore';
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
const router = useRouter();

const handleLogout = async () => {
  try {
    await useSession.logout();
    await router.push({ name: 'LoginPage' });
  } catch (error) {
    console.error('Failed to logout user', error);
  }
}

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
        <div class="d-md-flex gap-md-3 align-items-center pt-2">
          <li class="list-group-item ms-md-5 mt-3 mt-md-0">
            <div class="dropdown d-none d-md-inline-block">
              <a class="text-decoration-none text-md-dark dropdown-toggle" href="#" id="navProfileDesktop"
                data-bs-toggle="dropdown" aria-expanded="false">
                {{ useSession.name }} <i class="bi bi-caret-down-fill d-md-none"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navProfileDesktop">
                <li>
                  <router-link :to="{ name: 'UserProfile', params: { role: useSession.role, id: useSession.id } }"
                    class="dropdown-item"><i class="bi bi-person"></i> Profile
                  </router-link>
                </li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-gear"></i> Settings</a></li>
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

            <div class="d-md-none">
              <a class="text-md-dark text-decoration-none d-flex align-items-center justify-content-between"
                data-bs-toggle="collapse" href="#navbarMobileProfile" aria-expanded="false"
                aria-controls="navbarMobileProfile">
                {{ useSession.name }} <i class="bi bi-caret-down-fill"></i>
              </a>
              <div class="collapse mt-2" id="navbarMobileProfile">
                <ul class="list-group-flush">
                  <li class="list-group-item bg-transparent border-0 mb-1">
                    <router-link :to="{ name: 'UserProfile', params: { role: useSession.role, id: useSession.id } }"
                      class="dropdown-item"><i class="bi bi-person"></i> Profile
                    </router-link>
                  </li>
                  <li class="list-group-item bg-transparent border-0 mb-1">
                    <i class="bi bi-gear"></i> Settings
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
            </div>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.text-md-dark {
  color: #333;
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
