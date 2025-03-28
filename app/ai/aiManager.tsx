import ollama from "ollama/browser";
import ChatMessage from "./chatMessage";

export default class AiManager {
  async sendMessage(
    messageHistory: ChatMessage[],
    messageContent: string,
  ): Promise<AsyncGenerator<ChatMessage, void, unknown>> {
    const message = { role: "user", content: messageContent };

    const response = await ollama.chat({
      model: "deepseek-r1:1.5b",
      messages: [...messageHistory.map((msg) => msg.message), message],
      stream: true,
    });

    return ChatMessage.makeFromStream(response);
  }
}
