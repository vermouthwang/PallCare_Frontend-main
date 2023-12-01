<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import { useDiaryStore } from "../../stores/diary";
import { formatEntryDate } from "../../utils/formatDate";

const { getDiaryById, modifyDiaryContent } = useDiaryStore();
const props = defineProps(["_id"]);
let content = ref("");
let revealed = ref<boolean>(false);

async function submitForm() {
  await modifyDiaryContent(props._id, { content: content.value, revealed: revealed.value });
  await router.push({ name: "Diary" });
}
onBeforeMount(async () => {
  const diary = await getDiaryById(props._id);
  content.value = diary.content;
  revealed.value = diary.revealed;
});
</script>
<template>
  <body>
    <h1>Edit Diary</h1>
    <p class="entry-date">{{ formatEntryDate(new Date()) }}</p>
    <form class="edit-form" @submit.prevent="submitForm">
      <textarea class="diary-content" id="content" v-model="content" required> </textarea>
      <fieldset class="diary-fields">
        <label for="revealed">{{ revealed ? "Public" : "Private" }}</label>
        <input type="checkbox" v-model="revealed" />
      </fieldset>
      <button type="submit" class="pure-button-primary pure-button">Submit Edits</button>
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

.edit-form {
  display: flex;
  width: 60%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.edit-form * {
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
