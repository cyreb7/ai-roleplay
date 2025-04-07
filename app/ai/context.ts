import AiManager from "./aiManager";

export default class Context {
  #name: string;
  #aiManager: AiManager;
  getAiSystemPrompt: () => string;
  contents: string = "";

  constructor(
    name: string,
    aiManager: AiManager,
    getAiSystemPrompt: () => string,
  ) {
    this.#name = name;
    this.#aiManager = aiManager;
    this.getAiSystemPrompt = getAiSystemPrompt;
  }

  async *update(prompt: string | null = null): AsyncGenerator<string> {
    const response = await this.#aiManager.generate(
      prompt ?? this.contents,
      this.getAiSystemPrompt(),
    );

    this.contents = "";
    for await (const part of response) {
      this.contents += part.response;
      yield part.response;
    }

    return;
  }

  get name(): string {
    return this.#name;
  }
}
