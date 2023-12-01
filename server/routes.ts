import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Contact, Delay, Diary, Email, Friend, Letter, Mood, Post, Topic, User, WebSession, Wish } from "./app";
import { DiaryDoc } from "./concepts/diary";
import { NotAllowedError } from "./concepts/errors";
import { MoodDoc } from "./concepts/mood";
import { PostDoc, PostOptions } from "./concepts/post";
import { TopicDoc } from "./concepts/topic";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { WishDoc } from "./concepts/wish";
import Responses from "./responses";

//===============================================================
// HELPER FUNCTIONS FOR ROUTES
//===============================================================
async function timeCapsuleByOwner(user: ObjectId) {
  return (await Delay.getDelaysByOwner(user)).filter((delay) => Delay.isTimeCapsule(delay._id));
}

class Routes {
  // ############################################################
  // session
  // ############################################################
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  // ############################################################
  // user
  // ############################################################
  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  // ############################################################
  // post
  // ############################################################
  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  // ############################################################
  // friend
  // ############################################################
  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  // ############################################################
  // wish
  // ############################################################
  @Router.get("/wishes")
  async getWishes(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.wishes(await Wish.getByAuthor(user));
  }

  @Router.post("/wishes")
  async createWish(session: WebSessionDoc, content: string, visibility: "public" | ObjectId[] | "private") {
    const user = WebSession.getUser(session);
    const created = await Wish.create(user, content, visibility);
    return { msg: created.msg, wish: await Responses.wish(created.wish) };
  }

  @Router.patch("/wishes/:_id")
  async updatewish(session: WebSessionDoc, _id: ObjectId, update: Partial<WishDoc>) {
    const user = WebSession.getUser(session);
    await Wish.isAuthor(user, _id);
    return await Wish.update(_id, update);
  }

  @Router.delete("/wishes/:_id")
  async deletewish(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Wish.isAuthor(user, _id);
    return Wish.delete(_id);
  }

  // ############################################################
  // Topic/Forum
  // ############################################################
  @Router.get("/topics")
  async getTopics(page?: number, pagesize?: number) {
    // default page = 1, pagesize = 10
    const currentPage = page || 1;
    const pageSize = pagesize || 10;
    const totoalCount = await Topic.topics.count({});
    const pageCount = Math.ceil(totoalCount / pageSize);
    return { topics: await Topic.getNextTopics(currentPage, pageSize), page: currentPage, pageSize: pageSize, totalPage: pageCount, totalCount: totoalCount };
  }

  @Router.post("/topics")
  async createTopic(session: WebSessionDoc, title: string, content: string) {
    const user = WebSession.getUser(session);
    const created = await Topic.create(user, title, content);
    return { msg: created.msg, topic: await Responses.topic(created.topic) };
  }

  @Router.patch("/topics/:_id")
  async updateTopic(session: WebSessionDoc, _id: ObjectId, update: Partial<TopicDoc>) {
    const user = WebSession.getUser(session);
    await Topic.isAuthor(user, _id);
    return await Topic.update(_id, update);
  }

  @Router.delete("/topics/:_id")
  async deleteTopic(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Topic.isAuthor(user, _id);
    return Topic.delete(_id);
  }

  @Router.post("/topic/:_id/post")
  async addPostToTopic(_id: ObjectId, post: ObjectId) {
    return await Topic.addPost(_id, post);
  }

  @Router.delete("topic/:_id/post")
  async removePostFromTopic(session: WebSessionDoc, _id: ObjectId, post: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, post);
    // sync delete post
    await Post.delete(post);
    return await Topic.removePost(_id, post);
  }
  // ############################################################
  // Diary
  // ############################################################
  @Router.post("/diary")
  async createDiary(session: WebSessionDoc, content: string, hidden: boolean) {
    const user = WebSession.getUser(session);
    const created = await Diary.create(user, content, hidden);
    return { msg: created.msg, diary: await Responses.diary(created.diary) };
  }

  @Router.get("/diary/entries/:username")
  async getEntriesByAuthor(username: string) {
    const author = (await User.getUserByUsername(username))._id;
    const entries = await Diary.getEntriesByAuthor(author);
    return Responses.diaries(entries);
  }

  @Router.get("/diary/:_id")
  async getDiaryById(_id: ObjectId) {
    return Responses.diary(await Diary.getEntryById(_id));
  }

  @Router.get("/diary/hidden/:_id")
  async isDiaryHidden(_id: ObjectId) {
    return await Diary.isHidden(_id);
  }

  @Router.delete("/diary/:_id")
  async deleteDiary(session: WebSessionDoc, _id: ObjectId) {
    return await Diary.delete(_id);
  }

  @Router.patch("/diary/:_id")
  async modifyDiary(session: WebSessionDoc, _id: ObjectId, update: Partial<DiaryDoc>) {
    return await Diary.update(_id, update);
  }
  // ############################################################
  // Delay
  // ############################################################
  @Router.post("/delay")
  async createDelay(session: WebSessionDoc, content: ObjectId, type: "Diary" | "Letter", behavior: "send" | "delete" | "reveal" | "hide", activation: Date) {
    const user = WebSession.getUser(session);
    return await Delay.create(user, content, type, behavior, activation);
  }

  @Router.get("/delay/:_id")
  async getDelayById(_id: ObjectId) {
    return await Delay.getDelayByContent(_id);
  }

  @Router.get("/delay/content/:_id")
  async getDelayByContent(content: ObjectId) {
    return await Delay.getDelayByContent(content);
  }

  @Router.get("/delay/owner")
  async getDelaysByUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Delay.getDelaysByOwner(user);
  }

  @Router.get("/delay/expired/:_id")
  async isDelayExpired(_id: ObjectId) {
    return await Delay.isExpired(_id);
  }

  @Router.delete("delay/:_id")
  async deleteDelay(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Delay.checkRep(user, _id);
    return await Delay.delete(_id);
  }

  /**System function**/
  @Router.delete("/delay/executed/:_id")
  async executeDelay(_id: ObjectId) {
    const delay = await Delay.getDelayById(_id);
    await Delay.delete(_id); // want to delete Delay upon execution (whether it throws error or not)
    switch (delay.type) {
      case "Diary":
        switch (delay.behavior) {
          case "hide":
            return await Diary.update(delay.content, { hidden: true });
          case "reveal":
            return await Diary.update(delay.content, { hidden: false });
          case "delete":
            return await Diary.delete(delay.content);
          default:
            throw new NotAllowedError(`Behavior "${delay.behavior}" is not supported for a Delayed Diary.`);
        }
      case "Letter":
        switch (delay.behavior) {
          case "send":
            return await Letter.sendLetter(delay.content);
          case "delete":
            return await Letter.deleteLetter_server(delay.content);
          default:
            throw new NotAllowedError(`Behavior "${delay.behavior}" is not supported for a Delayed Letter.`);
        }
      default:
        throw new NotAllowedError(`Delay does not currently support content of type ${delay.type}.`);
    }
  }

  @Router.patch("/delay/activation/:_id&time")
  async updateDelayExpiration(session: WebSessionDoc, _id: ObjectId, activation: Date) {
    const user = WebSession.getUser(session);
    await Delay.checkRep(user, _id);
    return await Delay.updateActivation(_id, activation);
  }

  // ############################################################
  // Time Capsule: Delay + Diary + Letter
  // ############################################################
  @Router.post("/delay/timecapsule")
  async addToTimeCapsule(session: WebSessionDoc, content: ObjectId, type: "Diary" | "Letter") {
    const user = WebSession.getUser(session);
    const behavior = type === "Diary" ? "reveal" : "send";
    return await Delay.create(user, content, type, behavior, new Date(0));
  }

  @Router.get("delay/timecapsule")
  async getUserTimeCapsule(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await timeCapsuleByOwner(user);
  }

  /**System function**/
  @Router.delete("delay/timecapsule")
  async releaseTimeCapsule(user: ObjectId) {
    const timeCapsule = await timeCapsuleByOwner(user);
    for (const delay of timeCapsule) {
      await Delay.delete(delay._id);
      switch (delay.type) {
        case "Diary":
          await Diary.update(delay.content, { hidden: false });
          break;
        case "Letter":
          await Letter.sendLetter(delay.content);
          break;
        default:
          throw new NotAllowedError(`Delay does not currently support content of type ${delay.type}.`);
      }
    }
  }

  // ############################################################
  // Letter
  // ############################################################
  //CHECK//
  @Router.post("/letter")
  async createLetter(session: WebSessionDoc, to: ObjectId[], content: string, responseEnabled: boolean, delay?: string) {
    const user = WebSession.getUser(session);
    const newletter = await Letter.createLetter(user, to, content, responseEnabled);
    if (delay) {
      const delaydate = new Date(delay);
      if (newletter.letter !== null) {
        const letterdelay = await Delay.create(user, newletter.letter._id, "Letter", "reveal", delaydate);
        return { letter: newletter, delay: letterdelay };
      }
    }
    return newletter;
  }

  //CHECK//
  @Router.get("/letter")
  async getLetterbySender(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Letter.getLetterBySender(user);
  }

  //CHECK//
  @Router.get("/letter/receiver")
  async getLetterbyReceiver(user: ObjectId) {
    return await Letter.getLetterByReceiver(user);
  }

  //CHECK//
  @Router.get("/letter/id")
  async getLetterbyId(id: ObjectId) {
    return await Letter.getLetterById(id);
  }

  //CHECK//
  @Router.get("/letterunsent")
  async getAllunsendLetter(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Letter.getAllUnsentLetterbySender(user);
  }

  //CHECK//
  @Router.patch("/letter/content")
  async updateLetterContent(session: WebSessionDoc, letter: ObjectId, content: string) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(letter);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the author of this letter!");
    }
    return await Letter.updateLetterContent(letter, content);
  }

  //TODO//
  @Router.delete("/letter/receiver")
  async removeReceiver(session: WebSessionDoc, letter: ObjectId, receiver: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(letter);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the sender of this letter!");
    }
    return await Letter.removeLetterReceiver(letter, receiver);
  }

  //TODO//
  @Router.patch("/letter/receiver")
  async addReceiver(session: WebSessionDoc, letter: ObjectId, receiver: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(letter);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the sender of this letter!");
    }
    return await Letter.addLetterReceiver(letter, receiver);
  }

  //CHECK//
  @Router.patch("/letter")
  async sendLetter(session: WebSessionDoc, letter: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(letter);
    const username = (await User.getUserById(user)).username;
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the author of this letter!");
    }
    await Letter.sendLetter(letter);
    const thereceiver = theletter.to;
    for (const receiver of thereceiver) {
      if ((await Contact.checkContactType(user, receiver)) === "NonUser") {
        const receiveremail = await Contact.getemailaddressbyId(receiver);
        if (receiveremail === null) {
          continue;
        }
        await Email.send(username, receiveremail, theletter.content);
      }
    }
    return { msg: "Letter sent!" };
  }

  //check//
  @Router.get("/receiveletter")
  async receiveLetter(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Letter.receiveLetter(user);
  }

  @Router.patch("/letter/unshow")
  async unshowLetter(session: WebSessionDoc, letter: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(letter);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the author of this letter!");
    }
    return await Letter.unshowLetter(letter);
  }

  @Router.delete("/letter")
  async deleteLetterServer(letter: ObjectId) {
    return await Letter.deleteLetter_server(letter);
  }

  @Router.delete("/letter/client")
  async deleteLetterClient(session: WebSessionDoc, letter: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(letter);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the author of this letter!");
    }
    return await Letter.deleteLetter_client(letter);
  }

  @Router.patch("/letter/email")
  async sendLetterEmail(session: WebSessionDoc, letter: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(letter);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the author of this letter!");
    }
    // const thereceiver = theletter.to;
    return { msg: "No email sent!" };
  }
  
  // #############Letter Response#####################
  @Router.post("/letterrespond")
  async respondtoLetter(session: WebSessionDoc, originalletter: ObjectId, content: string) {
    const user = WebSession.getUser(session);
    const theresponse = await Letter.respondtoLetter(user, originalletter, content);
    return theresponse;
  }

  @Router.get("/letterrespond")
  async getLetterResponse(originalletter: ObjectId) {
    const theresponse = await Letter.getLetterResponseByLetter(originalletter);
    return theresponse;
  }

  //USE THIS IN ALPHA VERSION??
  @Router.get("/primaryrespond")
  async getPrimaryResponse(originalletter: ObjectId) {
    const theresponse = await Letter.getPrimaryResponse(originalletter);
    return theresponse;
  }

  // ############################################################
  // Contact
  // ############################################################
  @Router.post("/contact")
  async createUserContact(session: WebSessionDoc, contact: ObjectId) {
    const user = WebSession.getUser(session);
    return await Contact.createAppUserContact(user, contact);
  }

  @Router.get("/contact")
  async getContacts(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Contact.getContactsbyOwner(user);
  }

  @Router.get("/contact/type")
  async checkContactType(session: WebSessionDoc, contact: ObjectId) {
    const user = WebSession.getUser(session);
    return await Contact.checkContactType(user, contact);
  }

  // ##################### email #######################################
  @Router.post("/contact/email")
  async createEmailContact(session: WebSessionDoc, username: string, email: string) {
    const user = WebSession.getUser(session);
    return await Contact.createEmailContact(user, username, email);
  }

  @Router.get("/email")
  async getEmailaddressbyid(_id: ObjectId) {
    return await Contact.getemailaddressbyId(_id);
  }

  @Router.get("/email/:username")
  async getEmailaddressbyusername(username: string) {
    const emailcontact = await Contact.getEmailContactbyUsername(username);
    if (emailcontact === null) {
      throw new Error("Email contact not found!");
    }
    return emailcontact.email;
  }

  @Router.post("/email")
  async sendEmail(user: ObjectId, to: string, content: string) {
    const username = (await User.getUserById(user)).username;
    await Email.send(username, to, content);
    return { msg: "Email sent!" };
  }
  // Mood
  // ############################################################
  @Router.post("/moods")
  async createMood(session: WebSessionDoc, mood: string, notify: boolean, viewers?: ObjectId[]) {
    const user = WebSession.getUser(session);
    return await Mood.create(user, mood, notify, viewers);
  }

  @Router.patch("/moods/:_id")
  async updateMood(session: WebSessionDoc, _id: ObjectId, update: Partial<MoodDoc>) {
    const user = WebSession.getUser(session);
    await Mood.isOwner(user);
    return await Mood.update(_id, update);
  }

  @Router.get("/moods/:owner")
  async getMoods(owner?: string) {
    let moods;
    if (owner) {
      const _id = (await User.getUserByUsername(owner))._id;
      moods = await Mood.getByOwner(_id);
    } else {
      moods = await Mood.getMoods({});
    }
    return moods;
  }

  @Router.delete("/moods/:_id")
  async deleteMood(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Mood.isOwner(user);
    return Mood.delete(_id);
  }

  @Router.patch("/moods/:_id/addViewers")
  async addViewer(session: WebSessionDoc, viewer: ObjectId) {
    const user = WebSession.getUser(session);
    return await Mood.addViewer(user, viewer);
  }

  @Router.patch("/moods/:_id/removeViewers")
  async removeViewer(session: WebSessionDoc, viewer: ObjectId) {
    const user = WebSession.getUser(session);
    await Mood.isOwner(user);
    return await Mood.removeViewer(user, viewer);
  }
}

export default getExpressRouter(new Routes());
