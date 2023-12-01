<script setup lang="ts">
import router from "@/router";
import { usePreferenceStore } from "@/stores/preference";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";



const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn, isFamily } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const { showNav} = storeToRefs(usePreferenceStore());
const { logoutUser} = useUserStore();




// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  if(isLoggedIn.value)  {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }}else {
    logout();
  }

});

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}



</script>

<template>
  <header >
    <nav v-if="isLoggedIn && !showNav">
      <div class="title">
        <!-- <img src="@/assets/images/logo.svg" /> -->
      </div>
      
      <ul>
        <li v-if="isFamily">
          <RouterLink :to="{ name: 'Forum' }" :class="{ underline: currentRouteName == 'Forum' }"> Forum </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Forum' }" :class="{ underline: currentRouteName == 'Forum' }"> Forum </RouterLink>
        </li>

        <li>
          <RouterLink :to="{ name: 'Diary' }" :class="{ underline: currentRouteName == 'Diary' }"> Diary </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Delay' }" :class="{ underline: currentRouteName == 'Delay' }"> Delay </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Wish' }" :class="{ underline: currentRouteName == 'Wish' }"> Wish </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Letter' }" :class="{ underline: currentRouteName == 'Letter' }"> Letter </RouterLink>
        </li>
      </ul>
    </nav>
    <!-- <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article> -->
  </header>
 
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 0.5em;
  background-color: lightgray;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100vw;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}
</style>
