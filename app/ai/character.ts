export default class Character {
  #name: string;
  #description: string | null = null;

  constructor(name: string) {
    this.#name = name;
  }

  set name(name: string) {
    this.#name = name;
  }

  get name(): string {
    return this.#name;
  }

  set description(description: string | null) {
    this.#description = description;
  }

  get context(): string {
    let context = `Name:\n${this.#name}.`;
    if (this.#description) {
      context += `\n\nDescription:\n${this.#description}`;
    }
    return context;
  }
}
