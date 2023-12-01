<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";
import { useDiaryStore } from "../../stores/diary";
import { formatEntryDate } from "../../utils/formatDate";

const { createDiary } = useDiaryStore();
let content = ref("");
let revealed = ref<boolean>(false);

async function submitForm() {
  await createDiary(content.value, revealed.value);
  await router.push({ name: "Diary" });
}

</script>
<template>
  <body>
    <div class="navigation">
      <img @click="router.push({ name: 'Letter' })" src="@/assets/images/back.svg"/>
      <h1>New Letter</h1>
      
    </div>
    <form class="create-form" @submit.prevent="submitForm">
      <div class="letterinputspace">
        <textarea class="letter-content" id="content" v-model="content" placeholder="Write the letter here!" required> </textarea>
      </div>
      <div class="setting">
        <div class="field-title">
          <p class="setting-title">Settings</p>
          <span class="badge">?</span>
        </div>
        <fieldset class="letter-fields">
          <div class="left">
            <div class="delay">
              <p class="form-subtitle">Delay</p>
              <label class="switch">
                <input type="checkbox" v-model="delay">
                <span class="slider round"></span>
              </label>
            </div>

            <div class="delaytime">
              <p class="form-subtitle">Delay Date</p>
              <input class="input-bar" type="date" v-model.trim="delaydate" id="delay_date" placeholder="" required />
            </div>

            <div class="delay">
              <p class="form-subtitle">Time Capsule</p>
              <label class="switch">
                <input type="checkbox" v-model="timecapsule">
                <span class="slider round"></span>
              </label>
            </div>
          </div>

          <div class="right">
            <div class="delaytime">
              <p class="form-subtitle">Receiver</p>
              <input type="text" class="contact" v-model.trim="receiver" id="receiver" placeholder="Enter receiver's name" required />
            </div>
          </div>
        </fieldset>
      </div>
      <button type="submit" class="bluebuttoncenterlong">Create Letter</button>
    </form>
  </body>
</template>
<style scoped>


body {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 60px 18px 120px 18px;
  justify-content: space-between;
  flex-direction: column;
  background:#F0E7D8;
}

.setting{
  display: flex;
  height: 190px;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px 0px 0px 10px;
  gap: 0px;
}
.field-title{
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-title{
  color: #000;
  font-family: SF Pro Display;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 0px;
  /* line-height: 103.822%; 20.764px */
}
.navigation{
  display: flex;
  width: 300px;
  align-items: center;
  gap: 23px;
}

.letterinputspace{
  display: flex;
  width: 300px;
  height: 300px;
  padding-top: 10px;
  /* padding-bottom: 0px; */
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-space-075, 6px);
  border-radius: var(--numbers-spacing-12, 12px);
  background: #9FB9C7;
}

textarea.letter-content {
  display: flex;
  width: 260px;
  height: 216px;
  padding: 10px 11px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
}

.create-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.letter-fields {
  display: flex;
  width:290px;
  height: 120px;
  padding: 10px 0px 10px 10px;
  align-items: column;
  gap: 13px;
  flex-shrink: 0;
  border-radius: var(--numbers-spacing-12, 12px);
  border: 1.5px solid #000;
}
.left{
  
  gap: 12px;
}
.right{
  /* gap: 12px; */
  display: flex;
  width: 1px;
  flex-direction: column;
  align-items: column;
  gap: 1px;
  flex-shrink: 0;
}
.delay{
  display: flex;
  align-items: center;
  gap: 22px;
}

.form-subtitle{
  color: #000;
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 500;
  height: 1px;
  line-height: 0
  /* line-height: 103.822%; 13.497px */
}

.delay{
  display: flex;
  align-items: center;
  gap: 22px;
}

.checkbox{
  width: 40px;
}

input.contact{
  display: flex;
  width: 92px;
  height: 80px;
  align-items: flex-start;
  gap: 3px;
  flex-shrink: 0;
  border-radius: var(--numbers-spacing-12, 7px);
  border: 1.5px solid #000;
  font-size: 12px;
  align-items: flex-start;
}

</style>
