<script setup lang="ts">

defineProps<{ role: string }>();

</script>
<template>
  <div class="my-5">
    <div class="d-flex">
      <button class="btn btn-primary mb-2 ms-auto">
        <i class="bi bi-person-plus me-2 pt-1 mb-0"></i>
        <span>Add Resident</span>
      </button>
    </div>
    <div class="p-4 rounded border border-gray-500 ">
      <h3 class="text-center tracking-wider">RESIDENTS LIST</h3>
      <table class="table">
        <thead class="table-secondary">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email Address</th>
            <th scope="col">Contact Info</th>
            <th scope="col">Sitio</th>
            <th scope="col" span="2">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Mark Otto</th>
            <td>mark.Otto@email.com</td>
            <td>(+63) 912 123 1234</td>
            <td>Sitio Uno</td>
            <td>Update | Remove </td>
          </tr>
          <tr>
            <th scope="row">Dan Otto</th>
            <td>dan.Otto@email.com</td>
            <td>(+63) 912 321 4321</td>
            <td>Sitio Uno</td>
            <td>Update | Remove </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
