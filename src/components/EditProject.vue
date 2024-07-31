<template>
  <div class="edit-project" v-if="project">
    <h1>Edit Project</h1>
    <form @submit.prevent="submitForm">
      <label for="name">Name:</label>
      <input type="text" v-model="project.name" id="name" required/>

      <label for="intro">Intro:</label>
      <textarea v-model="project.intro" id="intro" required></textarea>

      <label for="startDate">Start Date:</label>
      <input type="date" v-model="project.startDate" id="startDate"/>

      <label for="endDate">End Date:</label>
      <input type="date" v-model="project.endDate" id="endDate" required/>

      <label for="status">Status:</label>
      <select v-model="project.status" id="status" required>
        <option value="pre">Pre</option>
        <option value="start">Start</option>
        <option value="end">End</option>
      </select>

      <button class="submit-button" type="submit">Update Project</button>
    </form>
    <div class="add-members">
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
      </div>
      <div>
        <div class="members-list" v-if="availableMembers">
          <h3>Available Members to add to this project: </h3>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="member in availableMembers" :key="member.username">
              <td>{{ member.id }}</td>
              <td>{{ member.username }}</td>
              <td>{{ member.fullName }}</td>
              <td>{{ member.email }}</td>
              <td>
                <button @click="addUser(member.id)">Add</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <button class="back-button" @click="goBack">Back</button>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import {useRoute, useRouter} from 'vue-router';

const project = ref({
  name: '',
  intro: '',
  startDate: '',
  endDate: '',
  status: 'pre',
  members: [],
  ownerId: 0,
});
const availableMembers = ref([]);
const route = useRoute();
const router = useRouter();
const user = ref({...localStorage.getObject('loggedInUser')});

const fetchProject = async () => {
  try {
    const response = await axios.get(
        `http://localhost:8080/api/v1/projects/${route.params.id}`,
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    const data = response.data;

    console.log('loaded single project:', data);

    project.value.name = data.name;
    project.value.intro = data.intro;
    project.value.startDate = data.startDateTime ? data.startDateTime.split('T')[0] : '';
    project.value.endDate = data.endDateTime ? data.endDateTime.split('T')[0] : '';
    project.value.status = data.projectStatus;
    project.value.members = data.members;
    project.value.ownerId = data.ownerId;
  } catch (error) {
    alert(error.response.data);
    console.error('Error fetching project details:', error);
  }
};

const submitForm = async () => {
  try {
    await axios.put(
        `http://localhost:8080/api/v1/projects/${route.params.id}`,
        {
          name: project.value.name,
          intro: project.value.intro,
          startDateTime: project.value.startDate ? new Date(project.value.startDate).toISOString() : null,
          endDateTime: new Date(project.value.endDate).toISOString(),
          projectStatus: project.value.status
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

const loadAvailableMembers = async () => {
  try {
    const response = await axios.get(
        `http://localhost:8080/api/v1/projects/${route.params.id}/available-users`,
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    availableMembers.value = response.data;
    console.log('available members: ', response);
  } catch (err) {
    alert('Error fetching available members for this project');
  }
}

const addUser = async (id) => {
  try {
    await axios.put(
        `http://localhost:8080/api/v1/projects/${route.params.id}/users`,
        [id],
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    await fetchProject();
    await loadAvailableMembers();
  } catch (error) {
    alert(error.response.data || 'Error adding user');
    console.error('Error adding user:', error);
  }
}

onMounted(async () => {
  await fetchProject();
  await loadAvailableMembers();

  if (project.value.ownerId !== user.value.id) {
    alert("You are not allowed to edit this project.");
    await router.push('/');
  }
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