<script setup lang="ts">
import { useMoodStore } from "@/stores/mood";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";


const notify = ref(false);
const { createMood, refreshMood} = useMoodStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

async function create(mood:string) {
  await createMood(mood, notify.value);
  await refreshMood(currentUsername.value);
}


</script>

<template>
    <div>
        <h2>How are you feeling today?</h2>
    </div>
    <div class="moods" >
        <div class="mood"  @click="create('Happy')">
            <p>Happy</p>
        </div>
        <div class="mood" @click="create('Chill')">
            <p>Chill</p>
        </div>
        <div class="mood" @click="create('Stressed')">
            <p>Stressed</p>
        </div>
        <div class="mood" @click="create('Sad')">
            <p>Sad</p>
        </div>
        <div class="mood" @click="create('Custom')">
            <p>Custom</p>
        </div>
    </div>
    <div class="options">
        <div class="notify">
            <input class="checkbox" type="checkbox" v-model.trim="notify" id="aligned-patient" />
              <label for="aligned-password">Notify?</label>
        </div>
        <div class="viewers">Edit viewers</div>
    </div>

</template>

<style scoped>

.mood {
    border-radius: 10px;
    border: 2px solid black;
    width: 75px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.moods {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.options {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    margin-top: 10px;
}

.notify {
    width: 90px;
}

.checkbox  {
    margin-right: 5px;
}

.viewers {
    text-decoration: underline;
}




</style>
