import ollama from "ollama/browser";
import ChatMessage from "./chatMessage";
import Character from "./character";
import { AbortableAsyncIterator, GenerateResponse } from "ollama";

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
      model: this.model.name,
      stream: true,
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
      model: this.model.name,
      stream: true,
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
