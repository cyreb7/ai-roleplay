import Character from "./character";
import ChatMessage from "./chatMessage";

export default class ChatRoom {
  #participants: Character[];
  #messages: ChatMessage[];

  constructor(participants: Character[]) {
    this.#participants = participants;
    this.#messages = [];
  }

  addMessage(message: ChatMessage) {
    this.#messages.push(message);
  }

  get messages() {
    return this.#messages;
  }

  get participants() {
    return this.#participants;
  }
}
