import Character from "./character";
import ChatMessage from "./chatMessage";

export default class ChatRoom {
  #participants: Character[];
  #messages: ChatMessage[];

  constructor() {
    this.#participants = [];
    this.#messages = [];
  }

  addParticipant(character: Character) {
    this.#participants.push(character);
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
