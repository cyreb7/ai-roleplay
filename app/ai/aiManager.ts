import ollama from "ollama/browser";
import ChatMessage from "./chatMessage";
import Character from "./character";
import { AbortableAsyncIterator, GenerateResponse } from "ollama";

export interface AiModel {
  name: string;
}

export default class AiManager {
  model: AiModel | null = null;
  static defaultSettings: object = {
    keep_alive: 60 * 60, // 1 hour
  };

  async getAllModesl(): Promise<AiModel[]> {
    const response = await ollama.list();
    return response.models.map((model) => ({ name: model.name }));
  }

  async sendMessage(
    chatHistory: ChatMessage[],
    chatParticipants: Character[],
    aiCharacter: Character,
  ): Promise<ChatMessage> {
    if (!this.model) {
      throw new Error("No model selected");
    }

    const messages = [
      aiCharacter.getGeneralContextMessage(chatParticipants),
      ...aiCharacter.getContextMessages(chatParticipants),
      ...chatHistory.map((msg) => msg.message),
    ];

    console.debug(messages);

    const response = await ollama.chat({
      ...AiManager.defaultSettings,
      stream: true,
      model: this.model.name,
      messages: messages,
    });

    return ChatMessage.makeFromStream(response, aiCharacter);
  }

  generate(
    prompt: string,
    system: string,
  ): Promise<AbortableAsyncIterator<GenerateResponse>> {
    if (!this.model) {
      throw new Error("No model selected");
    }
    console.debug(system, prompt);

    return ollama.generate({
      ...AiManager.defaultSettings,
      stream: true,
      model: this.model.name,
      prompt,
      system,
    });
  }

  makeMessage(messageContent: string, character: Character): ChatMessage {
    return new ChatMessage(
      {
        role: "user",
        content: messageContent,
      },
      character,
    );
  }
}
