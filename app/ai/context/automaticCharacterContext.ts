import AiManager from "../aiManager";
import Character from "../character";
import ChatRoom from "../chatRoom";
import ManualContext from "./manualContext";

export default class AutomaticCharacterContext extends ManualContext {
  #room: ChatRoom;
  #character: Character;

  constructor(
    name: string,
    aiManager: AiManager,
    getAiSystemPrompt: () => string,
    character: Character,
    room: ChatRoom,
  ) {
    super(name, aiManager, getAiSystemPrompt);
    this.#room = room;
    this.#character = character;
  }

  async *update(): AsyncGenerator<string> {
    const response = await this.aiManager.generate(
      this.#getUpdatePrompt(),
      this.getAiSystemPrompt(),
    );

    this.contents = "";
    for await (const part of response) {
      this.contents += part.response;
      yield part.response;
    }

    return;
  }

  #getUpdatePrompt(): string {
    let prompt = "";

    for (const message of this.#character.getContextMessages(this.#room)) {
      prompt += message.toString() + "\n\n";
    }

    return prompt;
  }
}
