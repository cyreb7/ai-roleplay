import ollama from "ollama/browser";
import ChatMessage from "./chatMessage";
import Character from "./character";
import { Message } from "ollama";

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
    aiCharacter: Character,
  ): Promise<ChatMessage> {
    if (!this.model) {
      throw new Error("No model selected");
    }

    const messages = [
      ...this.#getContextMessages(aiCharacter, messageHistory),
      ...messageHistory.map((msg) => msg.message),
    ];

    console.debug(messages);

    const response = await ollama.chat({
      model: this.model.name,
      messages: messages,
      stream: true,
    });

    return ChatMessage.makeFromStream(response, aiCharacter);
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

  #getUniqueCharacters(messageHistory: ChatMessage[]): Set<Character> {
    const characters = new Set<Character>();

    for (const msg of messageHistory) {
      characters.add(msg.character);
    }

    return characters;
  }

  #getContextMessages(
    aiCharacter: Character,
    messageHistory: ChatMessage[],
  ): Message[] {
    const historyCharacters = this.#getUniqueCharacters(messageHistory);
    historyCharacters.delete(aiCharacter);

    const contextMessages = [
      this.#getGeneralContextMessage(aiCharacter, historyCharacters),
      { role: "system", content: aiCharacter.context },
    ];

    for (const character of historyCharacters) {
      contextMessages.push({ role: "system", content: character.context });
    }

    return contextMessages;
  }

  #getGeneralContextMessage(
    aiCharacter: Character,
    historyCharacters: Set<Character>,
  ): Message {
    let content = `You are ${aiCharacter.name}.`;
    const otherCharacterNames: string[] = [];

    for (const character of historyCharacters) {
      otherCharacterNames.push(character.name);
    }

    if (otherCharacterNames.length > 0) {
      content += `\nOther characters present include: ${otherCharacterNames.join(", ")}.`;
    }

    return {
      role: "system",
      content: content,
    };
  }
}
