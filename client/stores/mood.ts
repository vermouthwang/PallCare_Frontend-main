import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { fetchy } from "@/utils/fetchy";

export const useMoodStore = defineStore(
  "mood",
  () => {
    const userMood = ref("");

    const hasMood = computed(() => userMood.value !== "");

    const resetStore = () => {
      userMood.value = "";
    };

    const createMood = async (mood: string, notify: boolean) => {
      const moodcreated = await fetchy("/api/moods", "POST", {
        body: { mood, notify },
      });
      //   userMood.value = moodcreated.mood.mood;
    };

    const refreshMood = async (_id: string) => {
      let mood;
      try {
        mood = await fetchy(`/api/moods/${_id}`, "GET", { alert: false });
        userMood.value = mood[0].mood;
      } catch {
        userMood.value = "";
      }
    };

    const getMoods = async () => {
      return await fetchy(`/api/moods`, "GET");
    };

    // const deleteMood = async () => {
    //   await fetchy("/api/moods", "DELETE");
    //   resetStore();
    // };

    return {
      userMood,
      hasMood,
      createMood,
      refreshMood,
      getMoods,
    };
  },
  { persist: true },
);
