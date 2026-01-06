<script setup lang="ts">
import FormSearchInput from '@/components/common/FormSearchInput/FormSearchInput.vue';
import Pagination from '@/components/common/Pagination/Pagination.vue';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import type { PageInfo, PaginationLink, User } from '@/Types';
import { formatName } from '@/Utils/helpers/formatters';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import { fetchAllUsers, toggleUserAccountStatus, softDeleteUserAccount } from '@/Utils/userServices';
import { computed, onMounted, reactive, ref } from 'vue';

defineProps<{ role: string }>();

const residents = ref<User[]>([]);
const navigation = useGlobalLoadingStore();
const session = useSessionStore();
const isAdmin = computed(() => session.isRoleAdmin());
const searchByNameKeyWord = ref<string>('');
const hasError = ref<boolean>(false);
const errorMessage = ref<string>('');
const sortMode = ref<'default' | 'address'>('default');

const pagination = reactive({
  current: 1,
  last: 1,
  perPage: 9,
  total: 0,
  links: [] as PaginationLink[],
});

const fetchResidentUsers = async (page: number = pagination.current, search?: string) => {
  navigation.startNavigation();
  hasError.value = false;
  try {
    const params: PageInfo = { page, per_page: pagination.perPage };
    const keyword = (search ?? searchByNameKeyWord.value.trim()) || undefined;

    if (keyword) {
      params.search = keyword;
    }

    if (sortMode.value === 'address') {
      params.sort = 'address';
    }

    const response = await fetchAllUsers(params);

    if (response.status !== 'success') {
      throw response;
    }

    const paginator = response.data;
    residents.value = paginator.data ?? [];
    pagination.current = paginator.current_page ?? 1;
    pagination.last = paginator.last_page ?? 1;
    pagination.total = paginator.total ?? 0;
    pagination.links = paginator.links ?? [];
  } catch (error: any) {
    hasError.value = true;
    errorMessage.value = error?.message ?? 'Failed to fetch residents.';
  } finally {
    navigation.endNavigation();
  }
};

const totalResidents = computed(() => pagination.total ?? residents.value.length);
const activeResidents = computed(() => residents.value.filter((user) => user.profile?.is_active).length);
const inactiveResidents = computed(() => residents.value.filter((user) => !user.profile?.is_active).length);

const handleToggleUserStatus = async (resident: User) => {
  const targetStatus = !resident.profile.is_active;
  const actionLabel = targetStatus ? 'activate' : 'deactivate';
  const shouldProceed = globalThis.confirm(`Are you sure you want to ${actionLabel} this user?`);

  if (!shouldProceed) {
    return;
  }

  navigation.startNavigation();
  try {
    await toggleUserAccountStatus(resident.id, targetStatus);
    await fetchResidentUsers(pagination.current);
  } catch (error: any) {
    hasError.value = true;
    errorMessage.value = error.message ?? 'Failed to update user status.';
  } finally {
    navigation.endNavigation();
  }
};

const handleSoftDelete = async (resident: User) => {
  const shouldProceed = globalThis.confirm(`Soft delete ${resident.email}? This will hide their account without permanent removal.`);
  if (!shouldProceed) return;

  navigation.startNavigation();
  try {
    await softDeleteUserAccount(resident.id);
    await fetchResidentUsers(pagination.current);
  } catch (error: any) {
    hasError.value = true;
    errorMessage.value = error?.message ?? 'Failed to delete user.';
  } finally {
    navigation.endNavigation();
  }
};

const isGovntIdNotFound = (resident: User) => {
  return resident.profile.government_identity === undefined || resident.profile.government_identity === null
}

const handleSearchResidentByName = () => {
  pagination.current = 1;
  fetchResidentUsers(pagination.current, searchByNameKeyWord.value.trim() || undefined);
};

const resetSearch = () => {
  searchByNameKeyWord.value = '';
  pagination.current = 1;
  fetchResidentUsers();
};

const toggleAddressSort = () => {
  sortMode.value = sortMode.value === 'address' ? 'default' : 'address';
  pagination.current = 1;
  fetchResidentUsers(pagination.current, searchByNameKeyWord.value.trim() || undefined);
};

onMounted(() => {
  fetchResidentUsers();
});
</script>

<template>
  <div class="my-5">
    <div
      class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3">
      <div>
        <p class="text-uppercase text-muted mb-1">Community Directory</p>
        <h2 class="fw-bold mb-0">Resident Profiles</h2>
        <p class="text-secondary small mb-0">Monitor household records, manage access, and keep resident data
          up-to-date.</p>
      </div>
      <router-link v-if="isAdmin" :to="{ name: 'CreateUserProfile' }" class="btn btn-primary text-nowrap">
        <i class="bi bi-person-plus me-2"></i> Add Resident
      </router-link>
    </div>

    <WarningLabel :has-error="hasError" :errors="hasError ? [{ error: errorMessage }] : []" />

    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">Total Residents</p>
            <h4 class="fw-bold mb-0">{{ totalResidents }}</h4>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">Active Accounts</p>
            <h4 class="fw-bold text-success mb-0">{{ activeResidents }}</h4>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">Inactive Accounts</p>
            <h4 class="fw-bold text-danger mb-0">{{ inactiveResidents }}</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <form class="row gy-3 align-items-center" @submit.prevent="handleSearchResidentByName">
          <div class="col-md-6 col-lg-4">
            <FormSearchInput v-model="searchByNameKeyWord" />
          </div>
          <div class="col-md-3 d-flex gap-2 ms-auto">
            <button class="btn btn-primary w-100" type="submit">Search</button>
          </div>
          <div class="col-12 col-lg-4 d-flex justify-content-lg-end">
            <button class="btn" :class="sortMode === 'address' ? 'btn-outline-secondary' : 'btn-outline-primary'"
              type="button" @click="toggleAddressSort">
              <i class="bi" :class="sortMode === 'address' ? 'bi-clock-history' : 'bi-sort-alpha-down'"></i>
              <span class="ms-2">{{ sortMode === 'address' ? 'Sort by Newest' : 'Sort by Address (A–Z)' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="!residents.length && !navigation.isNavigating" class="text-center py-5 bg-light rounded">
      <i class="bi bi-people display-4 text-muted"></i>
      <p class="mt-3 mb-1 fw-semibold">No residents found.</p>
      <p class="text-secondary mb-0">Adjust your search or add a new resident.</p>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3" v-else>
      <div class="col" v-for="resident in residents" :key="resident.id">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <router-link class="text-decoration-none text-dark fw-bold"
                  :to="{ name: 'UserProfile', params: { id: resident.id } }">
                  {{ formatName(resident.profile.first_name, resident.profile.middle_name, resident.profile.last_name)
                  }}
                </router-link>
                <p class="text-muted small mb-0">{{ resident.email }}</p>
              </div>
              <span class="badge text-uppercase"
                :class="resident.profile.is_active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-muted'">
                {{ resident.role }}
              </span>
            </div>
            <div class="text-secondary small mb-3">
              <p class="mb-1 text-capitalize"><i class="bi bi-geo-alt me-2 text-primary"></i>{{
                resident.profile?.street_address ||
                'Noaddress provided' }}</p>
              <p class="mb-1"><i class="bi bi-telephone me-2 text-primary"></i>{{
                resident.profile?.mobile_number ||
                'Nocontact info' }}</p>
            </div>
            <div class="mt-auto d-flex flex-column gap-2">
              <div class="d-flex align-items-center justify-content-between">
                <span class="fw-semibold">
                  <i class="bi"
                    :class="resident.profile.is_active ? 'bi-check-circle text-success' : 'bi-slash-circle text-danger'"></i>
                  {{ resident.profile.is_active ? 'Active' : 'Inactive' }}
                </span>
                <router-link class="btn btn-sm btn-outline-primary"
                  :to="{ name: 'UserProfile', params: { id: resident.id } }">
                  View Profile
                </router-link>
              </div>
              <button v-if="isAdmin" class="btn btn-sm"
                :class="[resident.profile.is_active ? 'btn-outline-danger' : isGovntIdNotFound(resident) ? 'btn-outline-secondary' : 'btn-outline-success']"
                type="button" @click="handleToggleUserStatus(resident)" :disabled="isGovntIdNotFound(resident)">
                <span v-if="resident.profile.is_active"><i class="bi bi-slash-circle me-1"></i>Deactivate</span>
                <span v-else><i class="bi bi-check-circle me-1"></i>Activate</span>
              </button>
              <button v-if="isAdmin" class="btn btn-sm btn-outline-secondary" type="button"
                @click="handleSoftDelete(resident)">
                <i class="bi bi-trash me-1"></i>Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center mt-4" v-if="pagination.links.length > 1">
      <Pagination :links="pagination.links" :disabled="navigation.isNavigating" :current-page="pagination.current"
        @change="fetchResidentUsers" />
    </div>
  </div>
</template>
