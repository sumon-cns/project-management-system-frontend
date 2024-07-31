<template>
  <div class="edit-project">
    <h1>Edit Project</h1>
    <form @submit.prevent="submitForm">
      <label for="name">Name:</label>
      <input type="text" v-model="name" id="name" required/>

      <label for="intro">Intro:</label>
      <textarea v-model="intro" id="intro" required></textarea>

      <label for="startDate">Start Date:</label>
      <input type="date" v-model="startDate" id="startDate" required/>

      <label for="endDate">End Date:</label>
      <input type="date" v-model="endDate" id="endDate" required/>

      <label for="status">Status:</label>
      <select v-model="status" id="status" required>
        <option value="pre">Pre</option>
        <option value="start">Start</option>
        <option value="end">End</option>
      </select>

      <button class="submit-button" type="submit">Update Project</button>
    </form>
    <button class="back-button" @click="goBack">Back</button>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import {useRoute, useRouter} from 'vue-router';

const name = ref('');
const intro = ref('');
const startDate = ref('');
const endDate = ref('');
const status = ref('pre'); // Default status
const route = useRoute();
const router = useRouter();
const user = ref({...localStorage.getObject('loggedInUser')});

const fetchProject = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/projects/${route.params.id}`,
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    const project = response.data;

    console.log('loaded single project:', project);

    name.value = project.name;
    intro.value = project.intro;
    startDate.value = project.startDateTime !== null ? project.startDateTime.split('T')[0] : '';
    endDate.value = project.endDateTime !== null ? project.endDateTime.split('T')[0] : '';
    status.value = project.projectStatus || 'pre'; // Default to 'pre' if not defined
  } catch (error) {
    console.error('Error fetching project details:', error);
  }
};

const submitForm = async () => {
  try {
    await axios.put(
        `http://localhost:8080/api/v1/projects/${route.params.id}`,
        {
          name: name.value,
          intro: intro.value,
          startDateTime: new Date(startDate.value).toISOString(),
          endDateTime: new Date(endDate.value).toISOString(),
          projectStatus: status.value, // Include status in the payload
        },
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    await router.push('/');
  } catch (error) {
    console.error('Error updating project:', error);
  }
};

const goBack = () => {
  router.back(); // Navigate back to the previous page
};

onMounted(() => {
  fetchProject();
});
</script>


<style scoped>
.edit-project {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-project h1 {
  text-align: center;
  margin-bottom: 20px;
}

.edit-project label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.edit-project input,
.edit-project textarea,
.edit-project select {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  font-size: 16px;
}

.edit-project input:focus,
.edit-project textarea:focus,
.edit-project select:focus {
  border-color: #007BFF;
  outline: none;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.back-button {
  margin-top: 2px;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #5a6268;
}
</style>