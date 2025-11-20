<script setup lang="ts">


</script>
<template>
  <footer class="bg-strong-blue text-white mt-auto">
    <div class="container py-5">
      <div class="row g-4">
        <div class="col-md-4">
          <h5 class="text-uppercase fw-bold mb-3">Barangay Alang-Alang</h5>
          <p class="text-white-50 small mb-3">
            Partnering with residents through transparent and responsive services.
          </p>
          <div class="d-flex gap-2">
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-facebook"></i></a>
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-envelope"></i></a>
          </div>
        </div>
        <div class="col-md-4">
          <h6 class="text-uppercase fw-semibold mb-3">Contact Details</h6>
          <ul class="list-unstyled text-white-50 small mb-0">
            <li class="mb-2"><i class="bi bi-geo-alt-fill me-2"></i>Brgy. Alang-Alang, Leyte</li>
            <li class="mb-2"><i class="bi bi-telephone-fill me-2"></i>+63 975 123 1234</li>
            <li><i class="bi bi-envelope-fill me-2"></i>barangay@alang-alang.gov</li>
          </ul>
        </div>
        <div class="col-md-4">
          <h6 class="text-uppercase fw-semibold mb-3">Quick Links</h6>
          <ul class="list-unstyled text-white-50 small mb-0">
            <li class="mb-2">
              <router-link to="/about" class="text-white-50 text-decoration-none">About the Barangay</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/services" class="text-white-50 text-decoration-none">Services</router-link>
            </li>
            <li>
              <router-link to="/contact" class="text-white-50 text-decoration-none">Contact Us</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="py-3 text-center small text-white-50 border-top border-white-25">
      <i class="bi bi-c-circle me-1"></i>2025 Brgy. Alang-Alang. All rights reserved.
    </div>
  </footer>
</template>
