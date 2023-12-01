<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useDiaryStore } from "../../stores/diary";
import { useUserStore } from "../../stores/user";
import DiaryComponent from "./DiaryComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { getAuthorEntries } = useDiaryStore();
const loaded = ref(false);
let diaryList = ref<Array<Record<string, string>>>([]);

async function getEntries() {
  diaryList.value = await getAuthorEntries(currentUsername.value);
}

onBeforeMount(async () => {
  await getEntries();
  loaded.value = true;
});
</script>

<template>
  <section class="diaryList" v-if="loaded && diaryList.length !== 0">
    <article v-for="diary in diaryList" :key="diary._id">
      <DiaryComponent v-if="currentUsername == diary.author || !diary.hidden" :diary="diary" @refreshDiaries="getEntries" />
    </article>
  </section>
  <p v-else-if="loaded">No diaries found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>
