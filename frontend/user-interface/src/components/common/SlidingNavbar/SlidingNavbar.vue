<script setup lang="ts">
import type { NavItem } from '@/Types';


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
</script>
<template>

  <div class="offcanvas offcanvas-start" data-bs-scroll="true" id="offcanvasScrolling" data-bs-backdrop="false"
    tabindex="-1" aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header bg-primary-gradient">
      <h5 class="offcanvas-title text-center text-white" id="offcanvasScrollingLabel">{{ title }}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <ul class="list-group-flush ms-auto">
        <div class="d-md-flex gap-md-3 align-items-center pt-2">
          <li v-for="item in navLinks" :key="item.path" class="list-group-item">
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
</template>
