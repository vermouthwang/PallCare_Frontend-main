<script setup lang="ts">
import router from "@/router";
import { useMoodStore } from "@/stores/mood";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";



const username = ref("");
const password = ref("");
const { createUser, loginUser, updateSession} = useUserStore();
const { refreshMood} = useMoodStore();



async function register() {

  await createUser(username.value, password.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void refreshMood(username.value);


  void router.push({ 
    name: "AccountType", 
  });

}
</script>

<template>
  <form class="pure-form" @submit.prevent="register">
    <fieldset>
      <div class="pure-control-group">
        <p class="form-title">Username</p>
        <!-- <label class="form-title" for="aligned-name"><p>Username</p></label> -->
        <input class="input-bar" v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <p class="form-title">Password</p>
        <!-- <label for="aligned-password">Password</label> -->
        <input class="input-bar" type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
    </fieldset>  
      <div >
        <button type="submit" class="pure-button-blue" >Register</button>
      </div>

  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
.pure-form{
  display: flex;
  width: 297px;
  height: 221px;
  padding: 0px 0px 14px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  flex-shrink: 0;
}
.pure-control-group{
  display: flex;
  width: 290px;
  flex-direction: column;
  align-items: flex-start;
}
.form-title{
  display: flex;
  width: 240px;
  height: 20px;
  flex-direction: column;
  justify-content: left;
  color: #000;
  font-family: SF Pro Display;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
input.input-bar{
  width: 297px;
  height: 45px;
  padding: 0px 12px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;  
  border: 1.5px solid #000;
  border-radius: var(--numbers-spacing-12, 12px);
  background-color: #F0E7D8;
}
button:hover {
background:rgba(255, 255, 255, 0.3); 
}

</style>
