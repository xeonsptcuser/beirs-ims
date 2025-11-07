<script setup lang="ts">
import Pagination from '@/components/common/Pagination/Pagination.vue';
import type { PaginationLink, User } from '@/Types';
import { fetchAllUsers } from '@/Utils/userServices';
import { onMounted, reactive, ref } from 'vue';


defineProps<{ role: string }>();

const residents = ref<User[]>();
const loading = ref<boolean>(false);

const pagination = reactive({
  current: 1,
  last: 1,
  perPage: 10,
  total: 0,
  links: [] as PaginationLink[],
});

const fetchResidentUsers = async (page = pagination.current) => {
  loading.value = true
  try {
    const response = await fetchAllUsers({ page, per_page: pagination.perPage });

    if (response.status !== 'success') {
      throw response;
    }
    const paginator = response.data;
    residents.value = paginator.data ?? [];
    pagination.current = paginator.current_page ?? 1;
    pagination.last = paginator.last_page ?? 1;
    pagination.total = paginator.total ?? 0;
    pagination.links = paginator.links ?? [];

  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}



onMounted(() => {
  fetchResidentUsers();
});

</script>
<template>
  <div class="my-5">
    <div class="d-flex">
      <router-link :to="{
        name: 'CreateUserProfile'
      }" class="btn btn-primary mb-3 ms-auto">
        <i class="bi bi-person-plus me-2 mb-0 fs-5"></i>
        <span>Add Resident</span>
      </router-link>
    </div>
    <div class="p-4 rounded border border-gray-500 ">
      <h3 class="text-center tracking-wider">RESIDENTS LIST</h3>
      <table class="table" v-if="!loading">
        <thead class="table-secondary">
          <tr>
            <th scope="col">Full Name</th>
            <th scope="col" class="text-center">Roles</th>

            <th scope="col" class="text-center">Sitio</th>
            <th scope="col" class="text-center">Active</th>
            <th scope="col" colspan="2" class="text-center">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resident in residents">
            <td class="align-middle">
              <router-link :to="{
                name: 'UserProfile',
                params: { id: resident.id }
              }" class="mb-0 py-1 text-md text-capitalize text-decoration-none">
                {{ resident.profile.name ?? '-' }}
              </router-link>
            </td>
            <td class="align-middle">
              <p class="mb-0 py-1 text-md ps-2 text-capitalize">{{ resident.role ?? '-' }}</p>
            </td>
            <td class="align-middle">
              <p class="mb-0 py-1 text-md ps-2">{{ resident.profile?.street_address ?? '-' }}</p>
            </td>
            <td class="align-middle text-center">
              <p class="mb-0 py-1 text-md "> <i class="bi-record-fill"
                  :class="[resident.profile.is_active ? 'text-success' : 'text-danger']"></i></p>
            </td>
            <td class="align-middle">
              <p class="mb-0 py-1 text-md"><i class="bi bi-pencil-square fs-5 text-warning"></i> Edit</p>
            </td>
            <td class="align-middle">
              <p class="mb-0 py-1 text-md"><i class="bi bi-slash-circle-fill fs-5 text-danger"></i> Deactivate</p>
            </td>
          </tr>
        </tbody>

      </table>
      <div v-else class="text-center">
        <p class="fs-3 tracking-widest">Loading...</p>
      </div>
      <Pagination v-if="!loading" class="d-flex justify-content-center" :links="pagination.links" :disabled="loading"
        :current-page="pagination.current" @change="fetchResidentUsers" />
    </div>

  </div>
</template>

<style scoped>
.text-md {
  font-size: 15px;
}
</style>
