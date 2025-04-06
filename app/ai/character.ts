import AiManager from "./aiManager";
import Context from "./context";
import ManualContext from "./manualContext";

export default class Character {
  #name: string;
  #traits: Context[] = [];

  constructor(name: string, aiManager: AiManager) {
    this.#name = name;
    this.#traits = [
      new ManualContext(
        "Description",
        aiManager,
        (): string =>
          `Write a detailed description for a character named "${this.name}". Do not respond with anything except the descripion.`,
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
}
