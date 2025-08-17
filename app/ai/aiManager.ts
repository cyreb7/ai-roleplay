import { Ollama } from "ollama/browser";
import ChatMessage, { getAiGenerateMessage } from "./chatMessage";
import {
  Character,
  getGeneralContextMessage,
  getContextMessages,
} from "./character";
import { AbortableAsyncIterator, GenerateResponse, ChatResponse } from "ollama";

const ollama = new Ollama({
  host: "http://127.0.0.1:11434",
});

export interface AiModel {
  name: string;
}

export default class AiManager {
  model: AiModel | null = null;
  static defaultSettings: object = {
    keep_alive: 60 * 60, // 1 hour
  };

  async getAllModels(): Promise<AiModel[]> {
    const response = await ollama.list();
    console.debug("Models", response);
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
      ...chatHistory
        .slice(0, -1)
        .map((msg) => getAiGenerateMessage(aiCharacter, msg)),
      ...getContextMessages(aiCharacter, chatParticipants),
      getGeneralContextMessage(aiCharacter, chatParticipants),
      getAiGenerateMessage(aiCharacter, chatHistory[chatHistory.length - 1]),
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
