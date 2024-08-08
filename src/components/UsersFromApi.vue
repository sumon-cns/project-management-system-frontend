<template>
  <div>
    <Sidebar/>
    <div class="container content">
<!--      <button @click="router.back()" class="back-button">Back</button>-->
      <p class="title">Users from API:</p>
      <table class="user-table">
        <thead>
        <tr>
          <th>Avatar</th>
          <th>ID</th>
          <th>Email</th>
          <th>First Name</th>
          <th>Last Name</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td><img :src="user.avatar" :alt="'avatar for user ' + user.id" class="avatar"></td>
          <td>{{ user.id }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.first_name }}</td>
          <td>{{ user.last_name }}</td>
        </tr>
        </tbody>
      </table>
      <Loader v-if="isLoading"/>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import Loader from "./Loader.vue";
import Sidebar from "./Sidebar.vue";

const router = useRouter();
const users = ref([]);
const isLoading = ref(false);

const fetchUserFromApi = async () => {
  const {data} = await axios.get("https://reqres.in/api/users");
  users.value = data.data; // [{id, email, first_name, last_name, avatar}]
}

onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchUserFromApi();
  } catch (err) {
    alert(err.response && err.response.data || 'Error fetching users');
  } finally {
    isLoading.value = false;
  }
});
</script>

<style>

.container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  /* border: 1px solid #ddd;
   border-radius: 8px;
   background-color: #f9f9f9;*/
}

.back-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: #0056b3;
}

.title {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.user-table th,
.user-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.user-table th {
  background-color: #f4f4f4;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
</style>
