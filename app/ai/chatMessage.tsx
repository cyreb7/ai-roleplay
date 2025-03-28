import { AbortableAsyncIterator, ChatResponse, Message } from "ollama";

export default class ChatMessage {
  #message;

  constructor(message: Message) {
    this.#message = message;
  }

  static makeFromStream(
    newMessage: AbortableAsyncIterator<ChatResponse>,
  ): AsyncGenerator<ChatMessage, void, unknown> {
    const message = new ChatMessage({} as Message);
    return message.streamMessage(newMessage);
  }

  async *streamMessage(
    newMessage: AbortableAsyncIterator<ChatResponse>,
  ): AsyncGenerator<ChatMessage, void, unknown> {
    for await (const part of newMessage) {
      if (!this.#message.content) {
        this.#message = part.message;
      } else {
        this.#message.content += part.message.content;
      }
      yield this;
    }
  }

  get content(): string {
    return this.#message.content;
  }

  get message(): Message {
    return this.#message;
  }
}
