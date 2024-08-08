<template>
  <div class="sidebar">
    <router-link :class="{'active': $route.fullPath==='/'}" to="/">Dashboard</router-link>
    <router-link :class="{'active': $route.fullPath==='/create-project'}" to="/create-project">
      Create Project
    </router-link>
    <router-link :class="{'active': $route.fullPath.includes('/projects')}" to="#">View Project</router-link>
    <router-link :class="{'active': $route.fullPath.includes('/edit-project')}" to="#">Edit Project</router-link>
    <router-link :class="{'active': $route.fullPath==='/users-from-api'}" to="/users-from-api">
      Users from api
    </router-link>
    <a href="http://localhost:8080/swagger-ui/index.html">API Docs</a>
    <router-link to="#" @click="handleLogout">Logout</router-link>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter();

const handleLogout = () => {
  localStorage.clear();
  router.push('/login');
};
</script>

<style>
body {
  margin: 0;
  /*  font-family: "Lato", sans-serif;*/
}

.sidebar {
  margin: 0;
  padding: 0;
  width: 200px;
  background-color: #f1f1f1;
  position: fixed;
  height: 100%;
  overflow: auto;
}

.sidebar a {
  display: block;
  color: black;
  padding: 16px;
  text-decoration: none;
}

.sidebar a.active {
  background-color: #04AA6D;
  color: white;
}

.sidebar a:hover:not(.active) {
  background-color: #555;
  color: white;
}

div.content {
  margin-left: 200px;
  padding: 1px 16px;
  /*height: 1000px;*/
}

@media screen and (max-width: 700px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .sidebar a {
    float: left;
  }

  div.content {
    margin-left: 0;
  }
}

@media screen and (max-width: 400px) {
  .sidebar a {
    text-align: center;
    float: none;
  }
}
</style>