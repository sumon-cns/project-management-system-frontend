<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome to the dashboard!</p>
    <button @click="handleLogout">Logout</button>

    <section>
      <p>Projects of user: {{ user.fullName }}</p>
    </section>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from 'vue-router';

onMounted(() => {
  console.log(localStorage.getObject('loggedInUser').token);
});

const router = useRouter();
const user = ref({...localStorage.getObject('loggedInUser')});

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
