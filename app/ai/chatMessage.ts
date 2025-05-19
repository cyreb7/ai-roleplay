import { Message } from "ollama";
import { Character } from "./character";

export default interface ChatMessage {
  message: Message;
  character: Character;
  generating: boolean;
  id: string;
}

export function getAiGenerateContext(chatLog: ChatMessage[]): string {
  return chatLog.map(getAiGenerateString).join("\n\n");
}

export function getAiGenerateMessage(message: ChatMessage): Message {
  return {
    ...message.message,
    content: getAiGenerateString(message),
  };
}

function getAiGenerateString(message: ChatMessage): string {
  return `${message.character.name}: ${message.message.content}`;
}
