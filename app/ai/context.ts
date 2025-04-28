import { Character, getContext } from "./character";
import ChatMessage, { getAiGenerateContext } from "./chatMessage";

export interface Context {
  name: string;
  getAiSystemPrompt: GetContextSystemPromptFunction;
  getGenerateOnNewMessageUserPrompt: GetContextUserPromptFunction | null;
  contents: string;
  generating: boolean;
}

export interface GetContextSystemPromptFunction {
  (thisCharacter: Character): string;
}

export interface GetContextUserPromptFunction {
  (chatLog: ChatMessage[]): string;
}

export function makeDescription(): Context {
  return {
    name: "Description",
    getAiSystemPrompt: (character: Character): string =>
      `Write a detailed description for a character named "${character.name}". Do not respond with anything except the descripion.`,
    contents: "",
    generating: false,
    getGenerateOnNewMessageUserPrompt: null,
  };
}

export function makeShortTermGoals(): Context {
  const name = "Short Term Goals";

  return {
    name,
    getAiSystemPrompt: (character: Character): string =>
      `Write a list of short term goals for "${character.name}". Do not respond with anything except the goals\n\nCharacter Information:\n${getContext(character)}.`,
    getGenerateOnNewMessageUserPrompt: (chatLog: ChatMessage[]): string =>
      `Recent Chat History:\n${getAiGenerateContext(chatLog)}`,
    contents: "",
    generating: false,
  };
}
