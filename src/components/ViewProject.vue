<template>
  <div>
    <Sidebar/>
    <div v-if="project" class="view-project content">
      <h1>Project Details</h1>
      <div v-if="project">
        <p><strong>Name:</strong> {{ project.name }}</p>
        <p><strong>Intro:</strong> {{ project.intro }}</p>
        <p><strong>Status:</strong> {{ project.projectStatus }}</p>
        <p><strong>Start Date:</strong>
          {{ project.startDateTime === null ? "--" : new Date(project.startDateTime).toDateString() }}
        </p>
        <p><strong>End Date:</strong>
          {{ project.endDateTime === null ? "--" : new Date(project.endDateTime).toDateString() }}
        </p>
      </div>
      <hr>
      <div class="members-list" v-if="project.members && project.members.length > 0">
        <h3>Members of this project: </h3>
        <table>
          <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="member in project.members" :key="member.username">
            <td>{{ member.username }}</td>
            <td>{{ member.fullName }}</td>
            <td>{{ member.email }}</td>
          </tr>
          </tbody>
        </table>
        <hr>
      </div>

      <div v-if="project.owner">
        <h3>Owner's info:</h3>
        <p><strong>Owner ID:</strong> {{ project.owner.id }}</p>
        <p><strong>Name:</strong> {{ project.owner.fullName }}</p>
        <p><strong>Username:</strong> {{ project.owner.username }}</p>
        <p><strong>Email:</strong> {{ project.owner.email }}</p>
      </div>

      <button v-if="false" class="back-button" @click="goBack">Back</button>
      <Loader v-if="isLoading"/>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import {useRoute, useRouter} from 'vue-router';
import Loader from "./Loader.vue";
import Sidebar from "./Sidebar.vue";
import {toast} from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

const project = ref({});
const route = useRoute();
const router = useRouter();
const user = ref({...localStorage.getObject('loggedInUser')});
const isLoading = ref(false);

const fetchProject = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`http://localhost:8080/api/v1/projects/${route.params.id}`,
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    project.value = response.data;
    console.log('loaded single project:', project.value);
  } catch (error) {
    toast(error.response && error.response.data || 'Error fetching project! Please try again');
    console.error('Error fetching project details:', error);
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push('/');
};

onMounted(() => {
  fetchProject();
});
</script>

<style scoped>
.view-project {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.project-details p {
  margin: 10px 0;
  font-size: 16px;
}

strong {
  font-weight: bold;
}

.back-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.back-button:hover {
  background-color: #0056b3;
}
</style>