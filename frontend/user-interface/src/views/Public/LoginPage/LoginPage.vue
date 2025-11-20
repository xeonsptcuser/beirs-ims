<script setup lang="ts">
import FormContainer from "@/components/common/FormContainer/FormContainer.vue";
import { useLoginAccount } from "./composable/useLoginAccount";
import { computed, onMounted, ref } from "vue";
import WarningLabel from "@/components/common/WarningLabel/WarningLabel.vue";
import SuccessLabel from "@/components/common/SuccessLabel/SuccessLabel.vue";
import type { ApiErrorResponse, LoginRequestPayload } from "@/Types";
import { userLogin } from "@/Utils/loginServices";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/Utils/store/useSessionStore";
import FormButton from "@/components/common/FormButton/FormButton.vue";
import { useGlobalLoadingStore } from "@/Utils/store/useGlobalLoadingStore";
import FormFloatingInput from "@/components/common/FormFloatingInput/FormFloatingInput.vue";

const {
  form,
  errors,
  errorMessages,
  isSuccessResponse,
  validateForm,
  clearSuccessResponse
} = useLoginAccount();

const hasError = ref(false);
const apiErrorMessage = ref('');
const router = useRouter();
const useSession = useSessionStore();
const navigation = useGlobalLoadingStore();

const handleLogin = async () => {
  clearSuccessResponse();
  apiErrorMessage.value = '';
  navigation.startNavigation();
  try {
    const isValid = validateForm()
    if (isValid) {
      const requestPayload: LoginRequestPayload = {
        email: form.email,
        password: form.password
      }

      const response = await userLogin(requestPayload)

      if (response.status !== 'success') {
        throw response;
      }


      hasError.value = false;
      apiErrorMessage.value = '';

      useSession.setSession(response);

      router.push({
        name: 'Dashboard',
        params: {
          role: response.user.role
        }
      });

    } else {
      hasError.value = true;
    };
  } catch (error) {
    hasError.value = true;
    const apiError = error as { response?: { data?: ApiErrorResponse } }
    const messageFromResponse =
      apiError?.response?.data?.message ||
      Object.values(apiError?.response?.data?.errors ?? {})
        .flat()
        .find(msg => !!msg)
    const fallbackMessage =
      error instanceof Error && error.message ? error.message : 'Failed to login. Please try again.'

    apiErrorMessage.value = messageFromResponse ?? fallbackMessage
  } finally {
    navigation.endNavigation()
  }
}

const filteredErrors = computed(() => {
  const fieldErrors = Object.values(errorMessages.value).filter(msg => msg.error && msg.error.trim() !== '')
  if (apiErrorMessage.value.trim()) {
    fieldErrors.unshift({ error: apiErrorMessage.value })
  }
  return fieldErrors
});

onMounted(() => {
  setTimeout(() => {
    clearSuccessResponse();
    sessionStorage.clear()
  }, 3000);
})

</script>
<template>
  <div class="login-wrapper py-5">
    <div class="container py-4">
      <div class="row align-items-center g-4">
        <div class="col-lg-6 ps-5">
          <p class="text-uppercase small fw-semibold text-primary mb-2">Welcome Back</p>
          <h1 class="display-6 fw-bold mb-3 text-dark">Access Your Barangay Portal</h1>
          <p class="text-muted mb-4">
            Track requests, file blotter reports, and stay informed of updates right from your dashboard.
          </p>
          <ul class="list-unstyled text-muted small mb-0">
            <li class="mb-2"><i class="bi bi-check-circle text-primary me-2"></i> Real-time updates and notifications
            </li>
            <li class="mb-2"><i class="bi bi-check-circle text-primary me-2"></i> Secure resident profile and documents
            </li>
            <li><i class="bi bi-check-circle text-primary me-2"></i> Faster processing with digital submissions</li>
          </ul>
        </div>
        <div class="col-lg-5 ms-auto">
          <FormContainer :has-error="hasError" title="Account Login">
            <WarningLabel :has-error="hasError" :errors="filteredErrors" />
            <SuccessLabel :is-success="!!isSuccessResponse?.status" :message="isSuccessResponse?.message" />
            <form class="d-flex flex-column gap-3" @submit.prevent="handleLogin">
              <FormFloatingInput type="text" label="Email Address" placeholder="Email Address" id="userName" autofocus
                v-model="form.email" :has-error="errors.email" :error-message="errorMessages.email.error" />
              <FormFloatingInput type="password" label="Password" placeholder="Password" id="passWord"
                v-model="form.password" :has-error="errors.password" :error-message="errorMessages.password.error" />
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Forgot password? Contact your barangay staff.</small>
                <FormButton label="Sign In" class="w-auto" />
              </div>
              <div class="text-center border-top pt-3">
                <p class="mb-0">Don't have an account yet?
                  <router-link to="/registration" class="btn btn-sm btn-outline-primary ms-1">Register Now</router-link>
                </p>
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  background: #fff;
}
</style>
