<script setup lang="ts">
import FormContainer from "@/components/common/FormContainer/FormContainer.vue";
import { useLogin } from "./composable/useLogin";
import { computed, ref } from "vue";
import WarningLabel from "@/components/common/WarningLabel/WarningLabel.vue";
import FormInput from "@/components/common/FormInput/FormInput.vue";

const {
  form,
  errorMessages,
  validateForm
} = useLogin();

// Shows error messages if true
const hasError = ref(false);

// This handles the login logic
const handleLogin = async () => {
  try {
    const isValid = validateForm()
    if (isValid) {
      // PERFORM logic to login user here...
      console.log("FORM: ", form)
      hasError.value = false;
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
      <FormContainer :has-error="hasError">
        <WarningLabel :has-error="hasError" :errors="filteredErrors" />
        <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleLogin">
          <FormInput type="text" label="Email Address" placeholder="beirs@test.com" id="userName" autofocus
            v-model="form.username" />
          <FormInput type="password" label="Password" placeholder="Password" id="passWord" autofocus
            v-model="form.password" />
          <button type="submit" class="btn btn-primary w-100 mt-2">Sign In</button>
          <hr>
          <p class="text-center">Don't have an account yet? <router-link to="/registration">Register Now</router-link>
          </p>
        </form>
      </FormContainer>
    </div>
  </div>
</template>
