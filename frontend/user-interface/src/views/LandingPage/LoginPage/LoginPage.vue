<script setup lang="ts">
import FormContainer from "@/components/common/FormContainer/FormContainer.vue";
import FormInput from "./components/FormInput.vue";
import { useLogin } from "./composable/useLogin";
import { computed, ref } from "vue";

const {
  form,
  errors,
  errorMessages,
  validateForm
} = useLogin();

const hasError = ref(false);

const handleLogin = async () => {
  try {
    const isValid = validateForm()
    if (isValid) {

      console.log('SUCCESS:', isValid)
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
      <FormContainer>
        <div class="alert alert-danger" role="alert" v-show="hasError">
          <ul class="bg-white rounded p-2 mb-1 list-group-flush">
            <li class="list-group-item mb-1" style="font-size: 13px;" v-for="message in filteredErrors"><i
                class="bi bi-exclamation-circle-fill" style="font-size: 13px;"></i> {{ message.error
                }}
            </li>
          </ul>
        </div>
        <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleLogin">
          <FormInput type="text" label="Username or Email" placeholder="Username or Email Address" class="form-control"
            id="userName" autofocus v-model="form.username" />
          <FormInput type="password" label="Password" placeholder="Password" class="form-control" id="passWord"
            autofocus v-model="form.password" />
          <button type="submit" class="btn btn-primary w-100 mt-2">Sign In</button>
        </form>
      </FormContainer>
    </div>
  </div>
</template>
