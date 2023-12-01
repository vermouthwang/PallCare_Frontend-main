import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface DiaryDoc extends BaseDoc {
  author: ObjectId;
  content: string; // could add extra types if necessary for images / video / audio recordings
  hidden: Boolean;
}

export default class DiaryConcept {
  public readonly diaries = new DocCollection<DiaryDoc>("diaries");

  /**
   * Create a new diary entry
   * @param author ObjectId associated w/ the author
   * @param content string representing the diary entry
   * @param hidden boolean to set if diary is initially hidden (false) or showing (true)
   * @returns adds a new DiaryDoc to 'this.diaries'
   */
  async create(author: ObjectId, content: string, hidden: boolean) {
    const _id = await this.diaries.createOne({ author, content, hidden });
    return { msg: "Created a diary entry.", diary: await this.diaries.readOne({ _id }) };
  }

  async checkRep(user: ObjectId, _id: ObjectId) {
    const diary = await this.diaries.readOne({ _id });
    if (!diary) {
      throw new NotFoundError("No diary associated with this id.");
    }
    if (user !== diary.author) {
      throw new NotAllowedError("User is not the author of this diary.");
    }
  }

  /**
   * Update a DiaryDoc within a collection
   * @param user ObjectId associated with the current user
   * @param _id ObjectId associated with a specific diary entry
   * @param newContent updated content to associate w/ a diary entry
   * @returns updates 'this.diaries.content' to 'newContent'
   */
  async update(_id: ObjectId, update: Partial<DiaryDoc>) {
    await this.diaries.updateOne({ _id }, update);
    return { msg: "Updated diary entry." };
  }

  /**
   * Delete a diary entry
   * @param _id ObjectId associated with a specific diary entry
   * @returns deletes diary w/ '_id' from 'this.diaries'
   */
  async delete(_id: ObjectId) {
    await this.diaries.deleteOne({ _id });
    return { msg: "Deleted diary entry." };
  }

  /**
   * Find all diary entries written by a specific user.
   * @param author ObjectId associated w/ the author
   * @returns all DiaryDocs in 'this.diaries' with 'this.diaries.author' === 'author'
   *          If user !== author, then only show the visible diary entries.
   */
  async getEntriesByAuthor(author: ObjectId) {
    return await this.diaries.readMany({ author }, { sort: { dateUpdated: -1 } });
  }

  async getEntryById(_id: ObjectId) {
    const entry = await this.diaries.readOne({ _id });
    if (!entry) {
      throw new NotFoundError("No Diary associated with given id.");
    }
    return entry;
  }

  /**
   * Checks whether a particular diary entry is hidden or not
   * @param _id ObjectId associated with a specific diary entry
   * @returns true iff 'this.diaries.hidden' === false
   */
  async isHidden(_id: ObjectId) {
    const diary = await this.diaries.readOne({ _id });
    if (!diary) {
      throw new NotFoundError(`Diary entry with id=${_id} DNE.`);
    } else {
      return diary.hidden === false;
    }
  }
}
