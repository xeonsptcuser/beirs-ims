<script setup lang="ts">
import FormContainer from "@/components/common/FormContainer/FormContainer.vue";
import { useLoginAccount } from "./composable/useLoginAccount";
import { computed, ref } from "vue";
import WarningLabel from "@/components/common/WarningLabel/WarningLabel.vue";
import FormInput from "@/components/common/FormInput/FormInput.vue";
import SuccessLabel from "@/components/common/SuccessLabel/SuccessLabel.vue";
import type { ApiErrorResponse, LoginRequestPayload } from "@/Types";
import { userLogin } from "@/Utils/loginServices";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/Utils/store/useSessionStore";

const {
  form,
  errorMessages,
  isSuccessResponse,
  validateForm,
  clearSuccessResponse
} = useLoginAccount();

const hasError = ref(false);
const apiErrorMessage = ref('');
const router = useRouter();
const useSession = useSessionStore();

const handleLogin = async () => {
  clearSuccessResponse();
  apiErrorMessage.value = '';
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
  }
}

const filteredErrors = computed(() => {
  const fieldErrors = Object.values(errorMessages.value).filter(msg => msg.error && msg.error.trim() !== '')
  if (apiErrorMessage.value.trim()) {
    fieldErrors.unshift({ error: apiErrorMessage.value })
  }
  return fieldErrors
});


</script>
<template>
  <div class="my-4">
    <div class="bg-primary p-6 rounded">
      <FormContainer :has-error="hasError" title="Account Login">
        <WarningLabel :has-error="hasError" :errors="filteredErrors" />
        <SuccessLabel :is-success="!!isSuccessResponse?.status" :message="isSuccessResponse?.message" />
        <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleLogin">
          <FormInput type="text" label="Email Address" placeholder="Email Address" id="userName" autofocus
            v-model="form.email" />
          <FormInput type="password" label="Password" placeholder="Password" id="passWord" autofocus
            v-model="form.password" />
          <button type="submit" class="btn btn-primary w-100 mt-2 py-2">SIGN IN</button>
          <hr>
          <p class="text-center mb-0">Don't have an account yet? <router-link to="/registration"
              class="btn btn-success">Register
              Now</router-link>
          </p>
        </form>
      </FormContainer>
    </div>
  </div>
</template>
