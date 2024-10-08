<template>
  <div>
    <Sidebar/>
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
      <div v-if="project.owner">
        <h3>Owner's info:</h3>
        <p><strong>Owner ID:</strong> {{ project.owner.id }}</p>
        <p><strong>Name:</strong> {{ project.owner.fullName }}</p>
        <p><strong>Username:</strong> {{ project.owner.username }}</p>
        <p><strong>Email:</strong> {{ project.owner.email }}</p>
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
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="member in project.members" :key="member.username">
            <td>{{ member.username }}</td>
            <td>{{ member.fullName }}</td>
            <td>{{ member.email }}</td>
            <td>
              <button @click="removeMember(member.id)">Remove</button>
            </td>
          </tr>
          </tbody>
        </table>
        <hr>
      </div>
      <div class="available-members-list" v-if="availableMembers">
        <h3>Available Members to add to this project: </h3>
        <Multiselect v-model="currentlySelectedMember"
                     searchable
                     mode="tags"
                     placeholder="Please Select One"
                     :options="availableMembers.map(member => (
                         {value: member.id, label: member.username + ' - ' + member.fullName }))"/>
        <br>
        <button class="submit-button" @click="addUser">Add Member(s)</button>
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
import 'vue3-toastify/dist/index.css';
import {toast} from "vue3-toastify";
import Sidebar from "./Sidebar.vue";
import Multiselect from "@vueform/multiselect";

const project = ref({
  name: '',
  intro: '',
  startDate: '',
  endDate: '',
  status: 'pre',
  members: [],
  ownerId: 0,
  owner: null
});
const availableMembers = ref([]);
const route = useRoute();
const router = useRouter();
const user = ref({...localStorage.getObject('loggedInUser')});
const isLoading = ref(false);
const currentlySelectedMember = ref([]);

const fetchProject = async () => {
  try {
    isLoading.value = true;
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
    project.value.owner = data.owner;
  } catch (error) {
    toast(error.response && error.response.data || "Error fetching project.");
    console.error('Error fetching project details:', error);
  } finally {
    isLoading.value = false;
  }
};

const submitForm = async () => {
  try {
    isLoading.value = true;
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
    toast("Successfully updated project!");
    // await router.push('/');
  } catch (error) {
    // alert(error.response && error.response.data || 'Error updating project! Please try again');
    toast(error.response && error.response.data || 'Error updating project! Please try again');
    console.error('Error updating project:', error);
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.back(); // Navigate back to the previous page
};

const loadAvailableMembers = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(
        `http://localhost:8080/api/v1/projects/${route.params.id}/available-users`,
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    availableMembers.value = response.data;
    console.log('available members: ', response);
  } catch (error) {
    await router.push('/');
    // alert('Error fetching available members for this project');
    toast(error.response && error.response.data || 'Error fetching available members for this project.');
  } finally {
    isLoading.value = false;
  }
}

const addUser = async () => {
  if (!currentlySelectedMember.value || !currentlySelectedMember.value.length) {
    toast("Please select one or more member(s) to add.");
    return;
  }
  try {
    isLoading.value = true;
    await axios.put(
        `http://localhost:8080/api/v1/projects/${route.params.id}/users`,
        currentlySelectedMember.value,
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    currentlySelectedMember.value = [];
    toast("Successfully added member(s)!");
    await fetchProject();
    await loadAvailableMembers();
  } catch (error) {
    // alert(error.response && error.response.data || 'Error adding user');
    toast(error.response && error.response.data || 'Error adding user');
    console.error('Error adding user:', error);
  } finally {
    isLoading.value = false;
  }
}

const removeMember = async (userId) => {
  try {
    isLoading.value = true;
    await axios.delete(
        `http://localhost:8080/api/v1/projects/${route.params.id}/users/${userId}`,
        {headers: {"Authorization": `Bearer ${user.value.token}`}}
    );
    toast("Successfully removed member!");
    await fetchProject();
    await loadAvailableMembers();
  } catch (error) {
    toast(error.response && error.response.data || 'Error removing user');
    console.error('Error removing user:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    await fetchProject();
    await loadAvailableMembers();

    if (project.value.ownerId && project.value.ownerId !== user.value.id) {
      await router.push('/');
      toast("You are not allowed to edit this project.");
    }

  } catch (error) {
    console.log('failed to load projects & available members');
  } finally {
    isLoading.value = false;
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

<style src="@vueform/multiselect/themes/default.css"></style>
