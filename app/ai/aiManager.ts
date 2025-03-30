import ollama from "ollama/browser";
import ChatMessage from "./chatMessage";
import Character from "./character";

export interface AiModel {
  name: string;
}

export default class AiManager {
  model: AiModel | null = null;

  async getAllModesl(): Promise<AiModel[]> {
    const response = await ollama.list();
    return response.models.map((model) => ({ name: model.name }));
  }

  async sendMessage(
    messageHistory: ChatMessage[],
    character: Character,
  ): Promise<ChatMessage> {
    if (!this.model) {
      throw new Error("No model selected");
    }

    const messages = [
      { role: "system", content: character.context },
      ...messageHistory.map((msg) => msg.message),
    ];

    console.debug(messages);

    const response = await ollama.chat({
      model: this.model.name,
      messages: messages,
      stream: true,
    });

    return ChatMessage.makeFromStream(response);
  }

  makeMessage(messageContent: string): ChatMessage {
    return new ChatMessage({ role: "user", content: messageContent });
  }
}
