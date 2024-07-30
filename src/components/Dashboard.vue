<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome to the dashboard!</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';

const router = useRouter();

function handleLogout() {
  localStorage.clear('jwt');
  router.push('/login');
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
</style>
