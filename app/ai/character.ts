import AiManager from "./aiManager";
import Context from "./context";
import { Message } from "ollama";

export default class Character {
  #name: string;
  #traits: Context[] = [];
  #privateContext: Context[] = [];

  constructor(name: string, aiManager: AiManager) {
    this.#name = name;
    this.#traits = [
      new Context(
        "Description",
        aiManager,
        (): string =>
          `Write a detailed description for a character named "${this.name}". Do not respond with anything except the descripion.`,
      ),
    ];
    this.#privateContext = [
      new Context(
        "Short Term Goals",
        aiManager,
        (): string =>
          `Look at the current character information and recent chat history, then write a list of short term goals for "${this.name}". Do not respond with anything except the goals.`,
      ),
    ];
  }

  set name(name: string) {
    this.#name = name;
  }

  get name(): string {
    return this.#name;
  }

  get traits(): Context[] {
    return this.#traits;
  }

  get context(): string {
    let context = `Name:\n${this.#name}.`;

    for (const trait of this.#traits) {
      const traitContext = trait.contents;
      if (traitContext) {
        context += `\n\n${trait.name}:\n${traitContext}`;
      }
    }

    return context;
  }

  getGeneralContextMessage(chatParticipants: Character[]): Message {
    let content = `You are ${this.name}.`;
    const otherCharacterNames: string[] = [];

    for (const character of chatParticipants) {
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

  getContextMessages(chatParticipants: Character[]): Message[] {
    const contextMessages = [];

    for (const character of [this, ...chatParticipants]) {
      contextMessages.push({ role: "system", content: character.context });

      if (character === this) {
        contextMessages.push({
          role: "system",
          content: this.#getPrivateContext(),
        });
      }
    }

    return contextMessages;
  }

  #getPrivateContext(): string {
    let context = "";

    for (const trait of this.#privateContext) {
      const traitContext = trait.contents;
      if (traitContext) {
        context += `\n\n${trait.name}:\n${traitContext}`;
      }
    }

    return context;
  }

  updateContext(): void {
    for (const context of this.#privateContext) {
      context.update();
    }
  }
}
