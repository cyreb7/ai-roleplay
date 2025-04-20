import { AbortableAsyncIterator, ChatResponse, Message } from "ollama";
import { Character } from "./character";

export default class ChatMessage {
  #message: Message;
  #character: Character;
  #streaming: AsyncGenerator<ChatMessage, void, unknown> | null;
  #id: string;
  static #idCounter = 0;

  constructor(message: Message, character: Character) {
    this.#message = message;
    this.#character = character;
    this.#streaming = null;

    ChatMessage.#idCounter++;
    this.#id = ChatMessage.#idCounter.toString();
  }

  static makeFromStream(
    newMessage: Promise<AbortableAsyncIterator<ChatResponse>>,
    character: Character,
  ): ChatMessage {
    const message = new ChatMessage({} as Message, character);
    message.streamMessage(newMessage);
    return message;
  }

  streamMessage(
    newMessage: Promise<AbortableAsyncIterator<ChatResponse>>,
  ): void {
    this.#streaming = this.#makeStreamMessageGenerator(newMessage);
  }

  async *#makeStreamMessageGenerator(
    newMessage: Promise<AbortableAsyncIterator<ChatResponse>>,
  ): AsyncGenerator<ChatMessage, void, unknown> {
    const response = await newMessage;
    let content = "";
    for await (const part of response) {
      content += part.message.content;
      part.message.content = content;
      this.#message = part.message;
      yield this;
    }
  }

  get content(): string {
    return this.#message.content;
  }

  get message(): Message {
    return this.#message;
  }

  get done(): AsyncGenerator<ChatMessage, void, unknown> | null {
    return this.#streaming;
  }

  get character(): Character {
    return this.#character;
  }

  get id(): string {
    return this.#id;
  }
}
