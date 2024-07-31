<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome {{ user.username }}!</p>
    <button @click="handleLogout">Logout</button>
    <button @click="createNewProject">Create New Project</button>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Intro</th>
        <th v-if="false">Owner ID</th>
        <th>Status</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="project in projects" :key="project.id">
        <td>{{ project.id }}</td>
        <td>{{ project.name }}</td>
        <td>{{ project.intro }}</td>
        <td v-if="false">{{ project.ownerId }}</td>
        <td>{{ project.projectStatus }}</td>
        <td>{{ project.startDateTime === null ? "--" : new Date(project.startDateTime).toDateString() }}</td>
        <td>{{ project.endDateTime === null ? "--" : new Date(project.endDateTime).toDateString() }}</td>
        <td>
          <button @click="viewProject(project.id)">View</button>
          <button v-if="user.id === project.ownerId" @click="editProject(project.id)">Edit</button>
          <button v-if="user.id === project.ownerId" @click="deleteProject(project.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';

const projects = ref([]);
const router = useRouter();
const user = ref({...localStorage.getObject('loggedInUser')});

function handleLogout() {
  localStorage.clear('loggedInUser');
  router.push('/login');
}

const fetchProjects = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/users/${user.value.id}/projects/all`,
        {headers: {"Authorization": `Bearer ${user.value.token}`}});
    projects.value = response.data;
    console.log('loaded projects: ', response.data);
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

const createNewProject = () => {
  router.push('/create-project'); // Adjust route as needed
};

const viewProject = (projectId) => {
  router.push(`/projects/${projectId}`);
};

const editProject = (projectId) => {
  router.push(`/edit-project/${projectId}`);
};

const deleteProject = async (projectId) => {
  const isConfirmed = confirm('Are you sure you want to delete this project?');
  if (isConfirmed) {
    try {
      await axios.delete(`http://localhost:8080/api/v1/projects/${projectId}`,
          {headers: {"Authorization": `Bearer ${user.value.token}`}});
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }
};

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

button {
  padding: 10px 15px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 10px;
  text-align: left;
}

thead {
  background-color: #f4f4f4;
}

thead th {
  position: sticky;
  top: 0;
  background-color: #f4f4f4;
}
</style>
