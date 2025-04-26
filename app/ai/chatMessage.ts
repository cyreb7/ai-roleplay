import { Message } from "ollama";
import { Character } from "./character";

export default interface ChatMessage {
  message: Message;
  character: Character;
  generating: boolean;
  id: string;
}
