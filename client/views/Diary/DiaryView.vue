<script setup lang="ts">
import DiaryListComponent from "../../components/Diary/DiaryListComponent.vue";
import router from "../../router";
</script>
<template>
  <body>
    <button class="btn-small pure-button" @click="router.push({ name: 'CreateDiary' })">Create Diary</button>
    <p>Previous Diaries</p>
    <DiaryListComponent />
  </body>
</template>
<style scoped>
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>
