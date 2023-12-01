// - **Concept: Delay [ T ]**
//     - **Purpose:** perform operation on content after a specified amount of time
//     - **Operating Principle:** after a specified time ***t**,* execute a function ***f*** on a piece of content of type ***T***
//     - **State**
//         - *content*: Set *T*
//         - *behavior*: *content* → One *function*
//         - *activation*: content → One Date
//     - **Actions**
//         - *createDelay*: *content* → One Delay
//         - *getDelay*: *content* → One Delay
//         - *deleteDelay*: *content* → One Delay
//         - *checkifDelayisOnTime*: *content* → One Boolean
//         - *getSortedDelaysIndex*: *content* → One Number
//         - *insertNewDelayIntoSortedDelays*: *content* → One Number
//         - *getNearestDelay*: *content* → One Delay
//         - *removeNearestDelay*: *content* → One Delay

import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface DelayDoc extends BaseDoc {
  owner: ObjectId;
  content: ObjectId;
  type: "Diary" | "Letter";
  behavior: "send" | "delete" | "reveal" | "hide";
  activation: Date;
}
//test
// export function testBehavior(content: any, other: string) {
//   console.log(content, other );
// }

export default class DelayConcept {
  public readonly delays = new DocCollection<DelayDoc>("delays");

  async create(owner: ObjectId, content: ObjectId, type: "Diary" | "Letter", behavior: "send" | "delete" | "reveal" | "hide", activation: Date) {
    const _id = await this.delays.createOne({ owner, content, type, behavior, activation });
    return { msg: "Created Delay!", delay: await this.delays.readOne({ _id }) };
  }

  async checkRep(user: ObjectId, _id: ObjectId) {
    const delay = await this.delays.readOne({ _id });
    if (!delay) {
      throw new NotFoundError("No delay associated with this id.");
    }
    if (user !== delay.owner) {
      throw new NotAllowedError("Current user is not the owner of this delay.");
    }
  }

  async getDelayById(_id: ObjectId) {
    const delay = await this.delays.readOne({ _id });
    if (!delay) {
      throw new NotFoundError("No such delay", _id);
    }
    return delay;
  }

  async getDelayByContent(content: ObjectId) {
    const delay = await this.delays.readMany({ content });
    if (!delay) {
      throw new NotFoundError("No such delay", content);
    }
    return delay;
  }

  async getDelaysByOwner(owner: ObjectId) {
    return await this.delays.readMany({ owner });
  }

  async delete(_id: ObjectId) {
    await this.delays.deleteOne({ _id });
    return { msg: "Deleted Delay!" };
  }

  async updateActivation(_id: ObjectId, activation: Date) {
    await this.getDelayById(_id); // assert there is a delay
    await this.delays.updateOne({ _id }, { activation: activation });
    return { msg: "Updated Delay Activation!" };
  }

  async isExpired(_id: ObjectId) {
    const delay = await this.getDelayById(_id);
    return !this.isTimeCapsule(_id) && delay.activation.getTime() > Date.now();
  }

  async isTimeCapsule(_id: ObjectId) {
    const delay = await this.getDelayById(_id);
    return delay.activation === new Date(0);
  }
}
