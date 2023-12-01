<script setup lang="ts">
import RegisterForm from "@/components/Login/RegisterForm.vue";
import router from "@/router";


async function goHome() {
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="centered">
    <div class="navigation">
      <img @click="goHome" src="@/assets/images/back.svg"/>
      <!-- <button @click="goHome" > BACK</button> -->
    </div>
    
    <h1>Register</h1>
    <section>
        <RegisterForm />

    </section>
  </main>
</template>

<style scoped>
h1 {
  display: flex;
  width: 299px;
  height: 12px;
  padding-top: 12px;
  align-items: center;
  flex-shrink: 0;
  color: #000;
  font-family: New York;
  font-size: 35px;
  font-style: normal;
  font-weight: 496;
  line-height: normal;
  text-transform: uppercase;
}
.navigation {
  display: flex;
  width: 298px;
  padding-right: 0px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
}
.centered{
position: absolute;
top: 40%;
left: 50%;
transform: translate(-50%, -50%);
width: 100vw;
height: 120vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
z-index: 10;
gap: 27px;
/* display: inline-flex; */
}

img:hover{
  width: 60px;
}
</style>
