<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome {{ user.username }}!</p>
    <button @click="handleLogout">Logout</button>


    <div class="table-container">
      <div style="display: flex; justify-content: end;">
        <button @click="createNewProject">Create New Project</button>
        <div class="date-range-picker">
          <input type="date" v-model="startDate" placeholder="Start Date"/>
          <input type="date" v-model="endDate" placeholder="End Date"/>
          <button @click="applyDateRange">Apply</button>
        </div>
        <button @click="downloadReports">Download Report</button>
      </div>


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
    <Loader v-if="isLoading"/>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';
import moment from "moment";
import Loader from "./Loader.vue";

const projects = ref([]);
const router = useRouter();
const user = ref({...localStorage.getObject('loggedInUser')});
const isLoading = ref(false);

const startDate = ref('');
const endDate = ref('');

function handleLogout() {
  localStorage.clear('loggedInUser');
  router.push('/login');
}

const fetchProjects = async (startDateParam = '', endDateParam = '') => {
  try {
    isLoading.value = true;
    const url = `http://localhost:8080/api/v1/users/${user.value.id}/projects?fromDate=${startDateParam}&toDate=${endDateParam}`;
    const response = await axios.get(url, {headers: {"Authorization": `Bearer ${user.value.token}`}});
    projects.value = response.data;
    console.log('loaded projects: ', response.data);
  } catch (error) {
    console.error('Error fetching projects:', error);
  } finally {
    isLoading.value = false;
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
  isLoading.value = true;
  const isConfirmed = confirm('Are you sure you want to delete this project?');
  if (isConfirmed) {
    try {
      await axios.delete(`http://localhost:8080/api/v1/projects/${projectId}`, {
        headers: {"Authorization": `Bearer ${user.value.token}`}
      });
      await fetchProjects(new Date(startDate.value).toISOString(), new Date(endDate.value).toISOString());
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      isLoading.value = false;
    }
  }
  isLoading.value = false;
};

const applyDateRange = () => {
  const startDateIso = new Date(startDate.value).toISOString();
  const endDateIso = new Date(endDate.value).toISOString();
  fetchProjects(startDateIso, endDateIso);
};

const calculateCurrentMonthDates = () => {
  // Use moment to get the first and last day of the current month
  const firstDay = moment().startOf('month').format('YYYY-MM-DD');
  const lastDay = moment().endOf('month').format('YYYY-MM-DD');

  startDate.value = firstDay;
  endDate.value = lastDay;
};

const downloadReports = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`http://localhost:8080/api/v1/users/${user.value.id}/projects/report?fromDate=${new Date(startDate.value).toISOString()}&toDate=${new Date(endDate.value).toISOString()}`, {
      responseType: 'blob',
      headers: {"Authorization": `Bearer ${user.value.token}`}
    });
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '');

    const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
  } finally {
    isLoading.value = false;
  }
};


onMounted(() => {
  calculateCurrentMonthDates();
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

.date-range-picker {
  /*position: absolute;
  top: 0;
  right: 0;*/
  display: flex;
  gap: 10px;
}

.date-range-picker input {
  padding: 5px;
}

.date-range-picker button {
  padding: 5px 10px;
}
</style>
