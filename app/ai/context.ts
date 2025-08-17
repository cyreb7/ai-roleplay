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
      `Write a detailed description for a character named "${character.name}". Do not respond with anything except the description.`,
    contents: "",
    generating: false,
    getGenerateOnNewMessageUserPrompt: null,
  };
}

export function makeShortTermGoals(): Context {
  return {
    name: "Short Term Goals",
    getAiSystemPrompt: (character: Character): string =>
      `Write a list of short term goals for "${character.name}" using the provided context. Do not respond with anything except the goals.\n\n${getContext(character, true)}\n\nYou will be given recent chat history for context.`,
    getGenerateOnNewMessageUserPrompt: (chatLog: ChatMessage[]): string =>
      getAiGenerateContext(chatLog),
    contents: "",
    generating: false,
  };
}

export function makeLongTermGoals(): Context {
  return {
    name: "Long Term Goals",
    getAiSystemPrompt: (character: Character): string =>
      `Write a list of long term goals for "${character.name}" using the provided context. Do not respond with anything except the goals.\n\n${getContext(character, true)}\n\nYou will be given recent chat history for context.`,
    getGenerateOnNewMessageUserPrompt: (chatLog: ChatMessage[]): string =>
      getAiGenerateContext(chatLog),
    contents: "",
    generating: false,
  };
}
