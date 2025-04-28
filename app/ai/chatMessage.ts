import { Message } from "ollama";
import { Character } from "./character";

export default interface ChatMessage {
  message: Message;
  character: Character;
  generating: boolean;
  id: string;
}

export function getAiGenerateContext(chatLog: ChatMessage[]): string {
  return chatLog
    .map((message) => `${message.character.name}: ${message.message.content}`)
    .join("\n\n");
}
