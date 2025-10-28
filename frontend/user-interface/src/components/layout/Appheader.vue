<script setup lang="ts">
import BeirsLogo from '@/assets/images/beirs-logo.png'

const navItems = [
  {
    path: '/',
    label: 'Home'
  },
  {
    path: '/about',
    label: 'About'
  },
  {
    path: '/services',
    label: 'Services'
  },
]
</script>
<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary-gradient">
    <div class="container d-flex align-items-center justify-between">
      <a href="#" class="d-flex text-decoration-none align-items-center">
        <img :src="BeirsLogo" alt="app-logo" height="65"></img>
       <div class="d-none d-md-block ms-2">
        <p class="text-white fw-bold mb-0">BEIRS-IMS</p>
        <small class=" leading-5 text-white">Barangay E-Blotter and Incident Reporting System</small>
      </div>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
        <span class="navbar-toggler-icon"></span>
      </button>
       <div class="offcanvas offcanvas-start" data-bs-scroll="true"  id="offcanvasScrolling" data-bs-backdrop="false" tabindex="-1" aria-labelledby="offcanvasScrollingLabel">
        <div class="offcanvas-header bg-primary-gradient">
          <h5 class="offcanvas-title text-center text-white" id="offcanvasScrollingLabel">Navigation Menu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="list-group-flush ms-auto">
            <div class="d-md-flex gap-md-3 align-items-center pt-2">
              <li v-for="item in navItems" :key="item.path" class="list-group-item">
                <router-link class="nav-link py-2 text-responsive" :to="item.path">{{ item.label }}</router-link>
              </li>
              <li class="list-group-item ms-md-5 mt-3 mt-md-0">
                <router-link class="nav-link text-responsive" to="/signin">
                  login
                </router-link>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.5); /* optional: white border */
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255,255,255,1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

.navbar-toggler:hover {
  border-color: #fff;
}

</style>
