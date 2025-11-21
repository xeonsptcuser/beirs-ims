<script setup lang="ts">
import { reactive, ref } from 'vue';
import FormFloatingInput from '@/components/common/FormFloatingInput/FormFloatingInput.vue';
import FormTextAreaInput from '@/components/common/FormTextAreaInput/FormTextAreaInput.vue';
import FormCheckboxInput from '@/components/common/FormCheckboxInput/FormCheckboxInput.vue';
import FormButton from '@/components/common/FormButton/FormButton.vue';
import { useBarangayAddresses } from '@/composables/useBarangayAddresses';
import { createBarangayAddress, updateBarangayAddress } from '@/Utils/addressServices';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';

defineProps<{ role: string }>();

const form = reactive({
  name: '',
  description: '',
  is_active: true,
});

const formError = ref('');
const formSuccess = ref('');
const isSubmitting = ref(false);
const togglingAddresses = ref(new Set<number>());

const navigation = useGlobalLoadingStore();
const {
  addresses,
  isLoadingAddresses,
  addressError,
  loadBarangayAddresses,
  refreshBarangayAddresses,
} = useBarangayAddresses();

loadBarangayAddresses();

const resetForm = () => {
  form.name = '';
  form.description = '';
  form.is_active = true;
};

const handleSaveAddress = async () => {
  formError.value = '';
  formSuccess.value = '';

  if (!form.name.trim()) {
    formError.value = 'Street or zone name is required.';
    return;
  }

  isSubmitting.value = true;
  navigation.startNavigation();
  try {
    await createBarangayAddress({
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      is_active: form.is_active,
    });
    formSuccess.value = 'Address saved successfully.';
    resetForm();
    await refreshBarangayAddresses();
  } catch (error: any) {
    formError.value = error?.message ?? 'Failed to save address.';
  } finally {
    isSubmitting.value = false;
    navigation.endNavigation();
  }
};

const toggleLoadingFlag = (id: number, enable: boolean) => {
  const updated = new Set(togglingAddresses.value);
  if (enable) {
    updated.add(id);
  } else {
    updated.delete(id);
  }
  togglingAddresses.value = updated;
};

const handleToggleStatus = async (addressId: number, currentStatus: boolean) => {
  formError.value = '';
  formSuccess.value = '';

  toggleLoadingFlag(addressId, true);
  try {
    await updateBarangayAddress(addressId, { is_active: !currentStatus });
    await refreshBarangayAddresses();
  } catch (error: any) {
    formError.value = error?.message ?? 'Failed to update address status.';
  } finally {
    toggleLoadingFlag(addressId, false);
  }
};

const isToggling = (id: number) => togglingAddresses.value.has(id);
</script>

<template>
  <section class="manage-addresses py-4 py-lg-5">
    <div class="container-xxl">
      <div class="row g-4 align-items-start">
        <div class="col-lg-5">
          <div class="card shadow-sm h-100 border-0">
            <div class="card-body p-4 p-lg-5">
              <p class="eyebrow text-primary mb-2">Admin Tools</p>
              <h3 class="fw-bold text-dark mb-3">Add a new street or zone</h3>
              <p class="text-muted mb-4">Keep the address directory updated so residents can quickly locate their
                area when filing requests and reports.</p>

              <div v-if="formError" class="alert alert-danger py-2">{{ formError }}</div>
              <div v-if="formSuccess" class="alert alert-success py-2">{{ formSuccess }}</div>

              <form class="d-flex flex-column gap-3" @submit.prevent="handleSaveAddress">
                <FormFloatingInput id="address-name" label="Street / Zone name" v-model="form.name"
                  :has-error="!form.name && !!formError" />
                <FormTextAreaInput id="address-description" label="Notes or description" v-model="form.description"
                  :optional="true" :is-resizeable="false" max-rows="4" />
                <FormCheckboxInput id="address-active" label="Set as active" v-model="form.is_active" />
                <div class="text-end">
                  <FormButton :label="isSubmitting ? 'Saving…' : 'Save Address'" :is-disabled="isSubmitting" />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4 p-lg-5">
              <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
                <div>
                  <p class="eyebrow text-muted mb-1">Directory overview</p>
                  <h4 class="fw-bold text-dark mb-0">Barangay addresses</h4>
                </div>
                <button class="btn btn-outline-primary btn-sm" type="button" :disabled="isLoadingAddresses"
                  @click="refreshBarangayAddresses">
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Refresh list
                </button>
              </div>

              <div v-if="addressError" class="alert alert-danger">{{ addressError }}</div>
              <div v-else-if="isLoadingAddresses" class="text-center py-5 text-muted">
                <div class="spinner-border text-primary mb-3" role="status"></div>
                <p class="mb-0">Loading addresses…</p>
              </div>
              <div v-else>
                <div v-if="!addresses.length" class="text-center py-5 text-muted">
                  <i class="bi bi-pin-map fs-1 mb-2"></i>
                  <p class="mb-1">No addresses saved yet.</p>
                  <small>Use the form to add your first street or zone.</small>
                </div>
                <ul v-else class="list-group list-group-flush address-list">
                  <li v-for="address in addresses" :key="address.id" class="list-group-item py-3 px-0">
                    <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                      <div>
                        <p class="mb-1 fw-semibold text-capitalize">{{ address.name }}</p>
                        <p class="mb-0 text-muted small">
                          {{ address.description || 'No description provided.' }}
                        </p>
                      </div>
                      <span class="badge rounded-pill"
                        :class="address.is_active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'">
                        {{ address.is_active ? 'Active' : 'Hidden' }}
                      </span>
                    </div>
                    <div class="mt-3 d-flex gap-2 flex-wrap">
                      <button class="btn btn-outline-secondary btn-sm" type="button"
                        @click="handleToggleStatus(address.id, address.is_active)" :disabled="isToggling(address.id)">
                        <span v-if="isToggling(address.id)" class="spinner-border spinner-border-sm me-1" />
                        {{ address.is_active ? 'Hide from dropdowns' : 'Mark as active' }}
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.manage-addresses {
  background-color: #f8fbff;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

.address-list .list-group-item {
  border-color: rgba(0, 0, 0, 0.05);
}

.address-list .list-group-item+.list-group-item {
  border-top-width: 1px;
}
</style>
