<script setup lang="ts">
import FormContainer from "@/components/common/FormContainer/FormContainer.vue";
import { useLoginAccount } from "./composable/useLoginAccount";
import { computed, ref } from "vue";
import WarningLabel from "@/components/common/WarningLabel/WarningLabel.vue";
import FormInput from "@/components/common/FormInput/FormInput.vue";
import SuccessLabel from "@/components/common/SuccessLabel/SuccessLabel.vue";
import type { LoginRequestPayload } from "@/Types";
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
const router = useRouter();
const useSession = useSessionStore();

const handleLogin = async () => {
  clearSuccessResponse();
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
    console.log("ERRORS: ", error)
  }
}

const filteredErrors = computed(() => {
  return Object.values(errorMessages.value).filter(msg => msg.error && msg.error.trim() !== '');
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
