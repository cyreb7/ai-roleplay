import { Context } from "./context";
import { Message } from "ollama";

export interface Character {
  name: string;
  publicContext: Context[];
  privateContext: Context[];
}

export function getContext(
  character: Character,
  includePrivate: boolean = false,
): string {
  let context = `Character Information for "${character.name}":`;

  for (const trait of [
    ...character.publicContext,
    ...(includePrivate ? character.privateContext : []),
  ]) {
    if (trait.contents) {
      context += `\n\n${getTraitContext(trait)}`;
    }
  }

  return context;
}

export function getGeneralContextMessage(
  thisCharacter: Character,
  chatParticipants: Character[],
): Message {
  let content = `You are ${thisCharacter.name}.`;
  const otherCharacterNames: string[] = [];

  for (const character of chatParticipants) {
    otherCharacterNames.push(character.name);
  }

  if (otherCharacterNames.length > 0) {
    content += `\nOther characters present include: ${otherCharacterNames.join(", ")}.`;
  }

  return {
    role: "system",
    content: content,
  };
}

export function getContextMessages(
  thisCharacter: Character,
  chatParticipants: Character[],
): Message[] {
  const contextMessages = [];

  for (const character of [thisCharacter, ...chatParticipants]) {
    contextMessages.push({
      role: "system",
      content: getContext(character, character === thisCharacter),
    });
  }

  return contextMessages;
}

function getTraitContext(context: Context): string {
  return `${context.name}:\n${context.contents}`;
}
