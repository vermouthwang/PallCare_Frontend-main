<script setup lang="ts">
import DiaryListComponent from "../../components/Diary/DiaryListComponent.vue";
import router from "../../router";
</script>
<template>
  <body>
    <button class="btn-small pure-button" @click="router.push({ name: 'CreateLetter' })">Create Letter</button>
    <p>Previous Letters</p>
    <!-- <DiaryListComponent /> -->
  </body>
</template>
<style scoped>
body {
  display: flex;
  width: 375px;
  height: 662px;
  padding: 60px 18px;
  flex-direction: column;
  align-items: center;
  gap: 13px;
}
</style>
