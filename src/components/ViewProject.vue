<template>
  <div class="view-project">
    <h1>Project Details</h1>
    <div v-if="project">
      <p><strong>Name:</strong> {{ project.name }}</p>
      <p><strong>Intro:</strong> {{ project.intro }}</p>
      <p><strong>Owner ID:</strong> {{ project.ownerId }}</p>
      <p><strong>Status:</strong> {{ project.projectStatus }}</p>
      <p><strong>Start Date:</strong>
        {{ project.startDateTime === null ? "--" : new Date(project.startDateTime).toDateString() }}
      </p>
      <p><strong>End Date:</strong>
        {{ project.endDateTime === null ? "--" : new Date(project.endDateTime).toDateString() }}
      </p>
    </div>
    <button class="back-button" @click="goBack">Back</button>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import {useRoute, useRouter} from 'vue-router';

const project = ref(null);
const route = useRoute();
const router = useRouter();
const user = ref({...localStorage.getObject('loggedInUser')});

const fetchProject = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/projects/${route.params.id}`,
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    project.value = response.data;
  } catch (error) {
    console.error('Error fetching project details:', error);
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