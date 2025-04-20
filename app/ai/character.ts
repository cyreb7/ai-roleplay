import { Context } from "./context";
import { Message } from "ollama";

export interface Character {
  name: string;
  publicContext: Context[];
  privateContext: Context[];
}

export function getContext(character: Character): string {
  let context = `Name:\n${character.name}.`;

  for (const trait of [
    ...character.publicContext,
    ...character.privateContext,
  ]) {
    const traitContext = trait.contents;
    if (traitContext) {
      context += `\n\n${trait.name}:\n${traitContext}`;
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
    contextMessages.push({ role: "system", content: getContext(character) });

    if (character === thisCharacter) {
      contextMessages.push({
        role: "system",
        content: thisCharacter.privateContext
          .filter((trait) => trait.contents !== "")
          .map((trait) => `${trait.name}:\n${trait.contents}`)
          .join("\n\n"),
      });
    }
  }

  return contextMessages;
}
