<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";
import { useDiaryStore } from "../../stores/diary";
import { formatEntryDate } from "../../utils/formatDate";

const { createDiary } = useDiaryStore();
let content = ref("");
let hidden = ref<boolean>(false);

async function submitForm() {
  await createDiary(content.value, hidden.value);
  await router.push({ name: "Diary" });
}
</script>
<template>
  <body>
    <h1>New Diary</h1>
    <p class="entry-date">{{ formatEntryDate(new Date()) }}</p>
    <form class="create-form" @submit.prevent="submitForm">
      <textarea class="diary-content" id="content" v-model="content" placeholder="Write a Diary Entry!" required> </textarea>
      <fieldset class="diary-fields">
        <label for="revealed">{{ hidden ? "Private" : "Public" }}</label>
        <input id="hidden" type="checkbox" v-model="hidden" />
      </fieldset>
      <button type="submit" class="pure-button-primary pure-button">Create Diary</button>
    </form>
  </body>
</template>
<style scoped>
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.entry-date {
  text-align: center;
  font-size: 1.5em;
}

.create-form {
  display: flex;
  width: 60%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.create-form * {
  margin-top: 20px;
}
.diary-content {
  width: 60%;
  height: 150px;
  flex-shrink: 0;
  border-radius: 7px;
  border: 1px solid #000;
}
</style>
