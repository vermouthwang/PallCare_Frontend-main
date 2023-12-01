import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { BodyT, fetchy } from "@/utils/fetchy";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUsername = ref("");

    // is patient or family
    const userType = ref("");

    const isLoggedIn = computed(() => currentUsername.value !== "");

    // is patient or family state
    const isFamily = computed(() => userType.value === "family");

    const resetStore = () => {
      currentUsername.value = "";
    };

    const createUser = async (username: string, password: string) => {
      await fetchy("/api/users", "POST", {
        body: { username, password },
      });
    };

    const loginUser = async (username: string, password: string) => {
      await fetchy("/api/login", "POST", {
        body: { username, password },
      });
    };

    const updateSession = async () => {
      try {
        const { username } = await fetchy("/api/session", "GET", { alert: false });
        currentUsername.value = username;
      } catch {
        currentUsername.value = "";
      }
    };

    const getUserType = async () => {
      const { userType: fetchedUserType } = await fetchy(`/api/users/${currentUsername.value}`, "GET");
      userType.value = fetchedUserType;
    };

    const getUsers = async () => {
      return await fetchy(`/api/users`, "GET");
    };

    const logoutUser = async () => {
      await fetchy("/api/logout", "POST");
      resetStore();
    };

    const updateUser = async (patch: BodyT) => {
      await fetchy("/api/users", "PATCH", { body: { update: patch } });
    };

    const deleteUser = async () => {
      await fetchy("/api/users", "DELETE");
      resetStore();
    };

    return {
      currentUsername,
      isLoggedIn,
      userType,
      isFamily,
      createUser,
      loginUser,
      updateSession,
      getUserType,
      getUsers,
      logoutUser,
      updateUser,
      deleteUser,
    };
  },
  { persist: true },
);
