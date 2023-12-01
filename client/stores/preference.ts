import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePreferenceStore = defineStore(
  "preference",
  () => {
    let isPreferenceViewOn = ref(false);

    const showNav = computed(() => isPreferenceViewOn.value !== false);

    const setOff = () => {
      isPreferenceViewOn.value = false;
    };

    const setOn = () => {
      isPreferenceViewOn.value = true;
    };

    return {
      isPreferenceViewOn,
      showNav,
      setOff,
      setOn,
    };
  },
  { persist: true },
);
