import { defineStore } from "pinia";

import { BodyT, fetchy } from "@/utils/fetchy";
import { ObjectId } from "mongodb";

export const useDiaryStore = defineStore(
  "diary",
  () => {
    const createDiary = async (content: string, hidden: boolean) => {
      await fetchy("/api/diary", "POST", {
        body: { content, hidden },
      });
    };

    const getAuthorEntries = async (username: string) => {
      return await fetchy(`/api/diary/entries/${username}`, "GET");
    };

    const getDiaryById = async (_id: ObjectId) => {
      return await fetchy(`/api/diary/${_id}`, "GET");
    };

    const deleteDiary = async (_id: ObjectId) => {
      return await fetchy(`/api/diary/${_id}`, "DELETE");
    };

    const isDiaryHidden = async (_id: ObjectId) => {
      return await fetchy(`/api/diary/revealed/${_id}`, "GET");
    };

    const modifyDiaryContent = async (_id: ObjectId, patch: BodyT) => {
      return await fetchy(`/api/diary/${_id}`, "PATCH", { body: { update: patch } });
    };

    return {
      createDiary,
      getAuthorEntries,
      getDiaryById,
      deleteDiary,
      isDiaryHidden,
      modifyDiaryContent,
    };
  },
  { persist: true },
);
