<template>
  <div class="registration-form">
    <h1>Register</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="fullName">Full Name</label>
        <input v-model="form.fullName" type="text" id="fullName" required/>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="form.email" type="email" id="email" required/>
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="form.username" type="text" id="username" required/>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="form.password" type="password" id="password" required/>
      </div>
      <button type="submit">Register</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
    <p class="login-prompt">
      Already have an account?
      <router-link to="/login">Login</router-link>
    </p>
    <Loader v-if="isLoading"/>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';
import Loader from "./Loader.vue";

const router = useRouter();

const form = ref({
  fullName: '',
  email: '',
  username: '',
  password: ''
});

const isLoading = ref(false);

const errorMessage = ref('');

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    const response = await axios.post('http://localhost:8080/api/v1/register', form.value);
    await router.push('/login');
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data;
    } else {
      errorMessage.value = 'Registration failed. Please try again later.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.registration-form {
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
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.error {
  color: red;
  margin-top: 10px;
}

.login-prompt {
  margin-top: 20px;
  text-align: center;
}

.login-prompt a {
  color: #007bff;
  text-decoration: none;
}

.login-prompt a:hover {
  text-decoration: underline;
}
</style>
