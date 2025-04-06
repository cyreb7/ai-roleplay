export default abstract class Context {
  #name: string;
  contents: string = "";

  constructor(name: string) {
    this.#name = name;
  }

  abstract update(): AsyncGenerator<string>;

  get name(): string {
    return this.#name;
  }
}
