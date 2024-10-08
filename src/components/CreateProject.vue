<template>
  <div>
    <Sidebar/>
    <div class="create-project content">
      <h1>Create New Project</h1>
      <form @submit.prevent="submitForm">
        <label for="name">Name:</label>
        <input type="text" v-model="name" id="name" required/>

        <label for="intro">Intro:</label>
        <textarea v-model="intro" id="intro" required></textarea>

        <label for="status">Status:</label>
        <select id="status" required v-model="projectStatus">
          <option value="">Select One</option>
          <option value="pre">Pre</option>
          <option value="start">Start</option>
          <option value="end">End</option>
        </select>

        <label for="startDate">Start Date:</label>
        <input type="date" v-model="startDate" id="startDate"/>

        <label for="endDate">End Date:</label>
        <input type="date" v-model="endDate" id="endDate" required/>

        <button class="submit-button" type="submit">Create Project</button>
      </form>
      <button v-if="false" class="back-button" @click="goBack">Back</button>
      <Loader v-if="isLoading"/>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';
import 'vue3-toastify/dist/index.css';
import {toast} from "vue3-toastify";
import Loader from "./Loader.vue";
import Sidebar from "./Sidebar.vue";

const name = ref('');
const intro = ref('');
const startDate = ref('');
const endDate = ref('');
const projectStatus = ref('');
const isLoading = ref(false);

const router = useRouter();
const user = ref({...localStorage.getObject('loggedInUser')});

const submitForm = async () => {
  try {
    isLoading.value = true;
    await axios.post(
        'http://localhost:8080/api/v1/projects',
        {
          name: name.value,
          intro: intro.value,
          ownerId: user.value.id,
          projectStatus: projectStatus.value,
          startDateTime: startDate.value ? new Date(startDate.value).toISOString() : null,
          endDateTime: new Date(endDate.value).toISOString(),
        },
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    toast("Successfully created project!");
    name.value = '';
    intro.value = '';
    projectStatus.value = '';
    startDate.value = '';
    endDate.value = '';
    // await router.push('/');
  } catch (error) {
    toast(error.response && error.response.data || 'Error creating project! Please try again');
    console.error('Error creating project:', error);
  } finally {
    isLoading.value = false;
  }
};
const goBack = () => {
  router.back();
};
</script>
<style scoped>
.create-project {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.create-project h1 {
  text-align: center;
  margin-bottom: 20px;
}

.create-project label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.create-project input,
.create-project textarea,
.create-project select {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ced4da;
  margin-bottom: 20px;
  font-size: 16px;
}

.create-project input:focus,
.create-project textarea:focus,
.create-project select:focus {
  border-color: #80bdff;
  outline: none;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #218838;
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

@media screen and (max-width: 1050px) {
  .create-project {
    margin-left: 200px;
  }
}

@media screen and (max-width: 700px) {
  .create-project {
    margin-left: 0;
  }
}
</style>