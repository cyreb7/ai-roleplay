import ollama from "ollama/browser";
import ChatMessage from "./chatMessage";
import {
  Character,
  getGeneralContextMessage,
  getContextMessages,
} from "./character";
import { AbortableAsyncIterator, GenerateResponse, ChatResponse } from "ollama";

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

  sendMessage(
    chatHistory: ChatMessage[],
    chatParticipants: Character[],
    aiCharacter: Character,
  ): Promise<AbortableAsyncIterator<ChatResponse>> {
    if (!this.model) {
      throw new Error("No model selected");
    }

    const messages = [
      getGeneralContextMessage(aiCharacter, chatParticipants),
      ...getContextMessages(aiCharacter, chatParticipants),
      ...chatHistory.map((msg) => msg.message),
    ];

    console.debug("Generating message...", messages);

    return ollama.chat({
      ...AiManager.defaultSettings,
      stream: true,
      model: this.model.name,
      messages: messages,
    });
  }

  generate(
    prompt: string,
    system: string,
  ): Promise<AbortableAsyncIterator<GenerateResponse>> {
    if (!this.model) {
      throw new Error("No model selected");
    }
    console.debug("Generating prompt...", { system, prompt });

    return ollama.generate({
      ...AiManager.defaultSettings,
      stream: true,
      model: this.model.name,
      prompt: prompt || " ", // LLMs don't do anything with an empty prompt
      system,
    });
  }
}
