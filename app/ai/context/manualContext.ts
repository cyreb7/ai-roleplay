import AiManager from "../aiManager";
import Context from "./context";

export default class ManualContext extends Context {
  getAiSystemPrompt: () => string;
  aiManager: AiManager;

  constructor(
    name: string,
    aiManager: AiManager,
    getAiSystemPrompt: () => string,
  ) {
    super(name);
    this.getAiSystemPrompt = getAiSystemPrompt;
    this.aiManager = aiManager;
  }

  async *update(): AsyncGenerator<string> {
    const context = this.contents;
    const response = await this.aiManager.generate(
      context,
      this.getAiSystemPrompt(),
    );

    this.contents = "";
    for await (const part of response) {
      this.contents += part.response;
      yield part.response;
    }

    return;
  }
}
