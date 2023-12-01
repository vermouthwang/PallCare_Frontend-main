<script setup lang="ts">

import router from "@/router";

import { usePreferenceStore } from "@/stores/preference";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";


const { setOn, setOff } = usePreferenceStore();
const { showNav} = storeToRefs(usePreferenceStore());


async function goHome() {
  setOff();
  void router.push({ name: "Home" });
}

onBeforeMount(() => {
  setOn();
});

async function accountType() {
  void router.push({ name: "AccountType" });
}




</script>

<template>
  <main>
    <img @click="accountType" src="@/assets/images/back.svg"/>

    <h1>Preference View Family</h1>
    <section>
      <!-- <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1> -->
        content...
    </section>
    <button @click="goHome" > Finish</button>

  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
