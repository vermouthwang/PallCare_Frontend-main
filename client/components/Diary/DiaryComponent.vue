<script setup lang="ts">
import { storeToRefs } from "pinia";
import { defineEmits } from "vue";
import router from "../../router";
import { useDiaryStore } from "../../stores/diary";
import { useUserStore } from "../../stores/user";
import { formatEntryDate } from "../../utils/formatDate";

const { deleteDiary } = useDiaryStore();
const props = defineProps(["diary"]);
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["refreshDiaries"]);

async function deleteDiaryEntry() {
  await deleteDiary(props.diary._id);
  emit("refreshDiaries");
}
</script>

<template>
  <p class="author">{{ props.diary.author }}</p>
  <p>{{ props.diary.content }}</p>
  <div class="base">
    <menu v-if="props.diary.author == currentUsername">
      <li>
        <p>{{ props.diary.hidden ? "Private" : "Public" }}</p>
      </li>
      <li><button class="btn-small pure-button" @click="router.push({ path: `/diary/edit/${diary._id}` })">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteDiaryEntry">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.diary.dateCreated !== props.diary.dateUpdated">Edited on: {{ formatEntryDate(props.diary.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatEntryDate(props.diary.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
