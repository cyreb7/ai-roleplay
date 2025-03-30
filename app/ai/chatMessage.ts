import { AbortableAsyncIterator, ChatResponse, Message } from "ollama";

export default class ChatMessage {
  #message;
  #streaming: AsyncGenerator<ChatMessage, void, unknown> | null;

  constructor(message: Message) {
    this.#message = message;
    this.#streaming = null;
  }

  static makeFromStream(
    newMessage: AbortableAsyncIterator<ChatResponse>,
  ): ChatMessage {
    const message = new ChatMessage({} as Message);
    message.streamMessage(newMessage);
    return message;
  }

  streamMessage(newMessage: AbortableAsyncIterator<ChatResponse>): void {
    this.#streaming = this.#makeStreamMessageGenerator(newMessage);
  }

  async *#makeStreamMessageGenerator(
    newMessage: AbortableAsyncIterator<ChatResponse>,
  ): AsyncGenerator<ChatMessage, void, unknown> {
    let content = "";
    for await (const part of newMessage) {
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
}
