import ollama from "ollama/browser";
import ChatMessage from "./chatMessage";

export default class AiManager {
  async sendMessage(messageHistory: ChatMessage[]): Promise<ChatMessage> {
    const response = await ollama.chat({
      model: "gemma3:4b",
      messages: [...messageHistory.map((msg) => msg.message)],
      stream: true,
    });

    return ChatMessage.makeFromStream(response);
  }

  makeMessage(messageContent: string): ChatMessage {
    return new ChatMessage({ role: "user", content: messageContent });
  }
}
