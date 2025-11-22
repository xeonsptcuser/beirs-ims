<script setup lang="ts">
import FormContainer from "@/components/common/FormContainer/FormContainer.vue";
import { useLoginAccount } from "./composable/useLoginAccount";
import { computed, onMounted, reactive, ref } from "vue";
import WarningLabel from "@/components/common/WarningLabel/WarningLabel.vue";
import SuccessLabel from "@/components/common/SuccessLabel/SuccessLabel.vue";
import type { ApiErrorResponse, LoginRequestPayload, LoginSuccessResponse } from "@/Types";
import { requestOtp, userLogin, verifyOtp } from "@/Utils/loginServices";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/Utils/store/useSessionStore";
import FormButton from "@/components/common/FormButton/FormButton.vue";
import { useGlobalLoadingStore } from "@/Utils/store/useGlobalLoadingStore";
import FormFloatingInput from "@/components/common/FormFloatingInput/FormFloatingInput.vue";
import { useOtpForm } from "./composable/useOtpForm";

const {
  form,
  errors,
  errorMessages,
  isSuccessResponse,
  validateForm,
  clearSuccessResponse
} = useLoginAccount();

const {
  form: otpForm,
  errors: otpErrors,
  errorMessages: otpErrorMessages,
  validateForm: validateOtpForm,
  resetForm: resetOtpForm,
} = useOtpForm();

const hasError = ref(false);
const apiErrorMessage = ref('');
const successMessage = ref('');
const authStage = ref<'credentials' | 'otp'>('credentials');
const otpUserId = ref<number | null>(null);
const cachedCredentials = reactive<LoginRequestPayload>({ email: '', password: '' });

const router = useRouter();
const useSession = useSessionStore();
const navigation = useGlobalLoadingStore();

const handleLoginSuccess = (response: LoginSuccessResponse) => {
  hasError.value = false;
  apiErrorMessage.value = '';
  successMessage.value = '';

  useSession.setSession(response);

  router.push({
    name: 'Dashboard',
    params: {
      role: response.user.role
    }
  });
};

const handleLogin = async () => {
  clearSuccessResponse();
  apiErrorMessage.value = '';
  successMessage.value = '';
  navigation.startNavigation();
  try {
    const isValid = validateForm()
    if (isValid) {
      const requestPayload: LoginRequestPayload = {
        email: form.email,
        password: form.password
      }

      const response = await userLogin(requestPayload)

      if (response.status === 'otp_required') {
        cachedCredentials.email = form.email
        cachedCredentials.password = form.password
        hasError.value = false;
        authStage.value = 'otp';
        otpUserId.value = response.user_id;
        successMessage.value = response.message ?? 'OTP sent.';
        return;
      }

      if (response.status !== 'success') {
        throw response;
      }

      handleLoginSuccess(response)

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

const handleVerifyOtp = async () => {
  hasError.value = false;
  apiErrorMessage.value = '';
  successMessage.value = '';

  if (!validateOtpForm()) {
    hasError.value = true;
    return;
  }

  if (!otpUserId.value) {
    apiErrorMessage.value = 'Missing user reference for OTP verification.'
    hasError.value = true;
    return;
  }

  navigation.startNavigation();
  try {
    const response = await verifyOtp({
      user_id: otpUserId.value,
      otp_code: otpForm.otp_code,
    })

    resetOtpForm()
    handleLoginSuccess(response)
  } catch (error) {
    hasError.value = true;
    const apiError = error as { response?: { data?: ApiErrorResponse } }
    const messageFromResponse =
      apiError?.response?.data?.message ||
      Object.values(apiError?.response?.data?.errors ?? {})
        .flat()
        .find(msg => !!msg)

    const fallbackMessage =
      error instanceof Error && error.message ? error.message : 'Failed to verify OTP. Please try again.'
    apiErrorMessage.value = messageFromResponse ?? fallbackMessage
  } finally {
    navigation.endNavigation()
  }
}

const handleResendOtp = async () => {
  hasError.value = false;
  apiErrorMessage.value = '';
  successMessage.value = '';

  navigation.startNavigation();
  try {
    const response = await requestOtp(cachedCredentials)
    if (response.status === 'otp_required') {
      otpUserId.value = response.user_id
      successMessage.value = response.message ?? 'A new OTP has been sent.'
    }
  } catch (error) {
    hasError.value = true;
    const apiError = error as { response?: { data?: ApiErrorResponse } }
    const messageFromResponse =
      apiError?.response?.data?.message ||
      Object.values(apiError?.response?.data?.errors ?? {})
        .flat()
        .find(msg => !!msg)

    const fallbackMessage =
      error instanceof Error && error.message ? error.message : 'Failed to resend OTP. Please try again.'
    apiErrorMessage.value = messageFromResponse ?? fallbackMessage
  } finally {
    navigation.endNavigation()
  }
}

const filteredErrors = computed(() => {
  const activeErrors = authStage.value === 'otp'
    ? Object.values(otpErrorMessages.value)
    : Object.values(errorMessages.value)

  const fieldErrors = activeErrors.filter(msg => msg.error && msg.error.trim() !== '')
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
            <SuccessLabel :is-success="!!(successMessage || isSuccessResponse?.status)"
              :message="successMessage || isSuccessResponse?.message" />
            <form class="d-flex flex-column gap-3"
              @submit.prevent="authStage === 'otp' ? handleVerifyOtp() : handleLogin()">
              <FormFloatingInput type="text" label="Email Address" placeholder="Email Address" id="userName" autofocus
                v-model="form.email" :has-error="errors.email" :error-message="errorMessages.email.error"
                :is-capitalized="false" :disabled="authStage === 'otp'" />
              <FormFloatingInput type="password" label="Password" placeholder="Password" id="passWord"
                v-model="form.password" :has-error="errors.password" :error-message="errorMessages.password.error"
                :is-capitalized="false" :disabled="authStage === 'otp'" />

              <FormFloatingInput v-if="authStage === 'otp'" type="text" label="One-Time Password"
                placeholder="Enter OTP" id="otp"
                v-model="otpForm.otp_code" :has-error="otpErrors.otp_code"
                :error-message="otpErrorMessages.otp_code.error" :is-capitalized="false" />

              <FormButton :label="authStage === 'otp' ? 'Verify OTP' : 'Sign In'" class="w-100" />

              <button v-if="authStage === 'otp'" type="button" class="btn btn-outline-primary w-100"
                @click="handleResendOtp">
                Resend OTP
              </button>

              <div class="text-center" v-if="authStage === 'otp'">
                <small class="text-muted">Enter the 6-digit code sent to your registered mobile number.</small>
              </div>

              <div class="text-center">
                <small class="text-muted">Forgot password? Contact your barangay staff.</small>
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

.btn.w-100 {
  display: block;
}
</style>
