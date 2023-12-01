import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface MoodDoc extends BaseDoc {
  owner: ObjectId;
  viewers?: ObjectId[];
  mood: string;
  notify: boolean;
}

export default class MoodConcept {
  public readonly moods = new DocCollection<MoodDoc>("moods");

  async create(owner: ObjectId, mood: string, notify: boolean, viewers?: ObjectId[]) {
    const existingMood = await this.moods.readOne({ owner });
    if (existingMood) {
      // If a mood already exists, update it
      await this.update(existingMood._id, { mood: mood });
      return { msg: "Mood updated successfully!", mood: await this.moods.readOne({ owner }) };
    } else {
      if (mood && owner) {
        const _id = await this.moods.createOne({ owner, mood, notify, viewers });
        return { msg: "User created successfully!", mood: await this.moods.readOne({ _id }) };
      } else {
        throw new NotAllowedError("owner and mood must be non-empty!");
      }
    }
  }

  async update(_id: ObjectId, update: Partial<MoodDoc>) {
    await this.moods.updateOne({ _id }, update);
  }

  async isOwner(user: ObjectId) {
    const mood = await this.moods.readOne({ user });
    if (!mood) {
      throw new NotFoundError(`Mood for ${user} does not exist!`);
    }
    if (mood.owner.toString() !== user.toString()) {
      throw new NotAllowedError("You are not the owner of this mood!");
    }
  }

  async getMoods(query: Filter<MoodDoc>) {
    const moods = await this.moods.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return moods;
  }

  async getByOwner(owner: ObjectId) {
    return await this.getMoods({ owner });
  }

  async delete(_id: ObjectId) {
    await this.moods.deleteOne({ _id });
    return { msg: "Mood deleted successfully!" };
  }

  async addViewer(owner: ObjectId, viewer: ObjectId) {
    const mood = await this.moods.readOne({ owner });
    if (!mood) {
      throw new NotFoundError(`Mood for ${owner} does not exist!`);
    }
    // Add the viewer to the viewers array if it's not already there
    if (!mood.viewers || !mood.viewers.includes(viewer)) {
      const updatedViewers = mood.viewers ? [...mood.viewers, viewer] : [viewer];
      await this.moods.updateOne({ owner }, { viewers: updatedViewers });
    }
    return { msg: "Viewer added successfully!" };
  }

  async removeViewer(owner: ObjectId, viewer: ObjectId) {
    const mood = await this.moods.readOne({ owner });
    if (!mood) {
      throw new NotFoundError(`Mood for ${owner} does not exist!`);
    }
    // Remove the viewer from the viewers array if it's there
    if (mood.viewers && mood.viewers.includes(viewer)) {
      const updatedViewers = mood.viewers.filter((v) => !v.equals(viewer));
      await this.moods.updateOne({ owner }, { viewers: updatedViewers });
    }
    return { msg: "Viewer removed successfully!" };
  }
}
