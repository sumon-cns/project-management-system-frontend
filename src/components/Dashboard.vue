<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome to the dashboard!</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {useRouter} from 'vue-router';

onMounted(() => {
  console.log(localStorage.getObject('loggedInUser').token);
});

const router = useRouter();

function handleLogout() {
  localStorage.clear('loggedInUser');
  router.push('/login');
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
</style>
