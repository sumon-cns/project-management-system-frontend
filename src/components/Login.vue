<template>
  <div class="login-form">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="form.username" type="text" id="username" required/>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="form.password" type="password" id="password" required/>
      </div>
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
    <p class="register-prompt">
      Don't have an account yet?
      <router-link to="/register">Register now</router-link>
    </p>
    <Loader v-if="isLoading"/>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';
import Loader from "./Loader.vue";

const form = ref({
  username: '',
  password: ''
});

const errorMessage = ref('');
const router = useRouter();
const isLoading = ref(false);

onMounted(() => {
  if (localStorage.getItem('loggedInUser')) {
    router.push('/');
  }
})

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    const response = await axios.post('http://localhost:8080/api/v1/login', form.value);
    const data = response.data;
    localStorage.setObject('loggedInUser', data);
    await router.push('/');
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data;
    } else {
      errorMessage.value = 'Login failed. Please try again later.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}

.register-prompt {
  margin-top: 20px;
  text-align: center;
}

.register-prompt a {
  color: #007bff;
  text-decoration: none;
}

.register-prompt a:hover {
  text-decoration: underline;
}
</style>
