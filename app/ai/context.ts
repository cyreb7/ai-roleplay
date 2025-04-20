import AiManager from "./aiManager";
import { Character } from "./character";

export interface Context {
  name: string;
  getAiSystemPrompt: GetContextFunction;
  contents: string;
}

export interface GetContextFunction {
  (character: Character): string;
}

export async function* update(
  context: Context,
  prompt: string,
  aiManager: AiManager,
  character: Character,
): AsyncGenerator<string> {
  const response = await aiManager.generate(
    prompt,
    context.getAiSystemPrompt(character),
  );

  let contents = "";
  for await (const part of response) {
    contents += part.response;
    yield part.response;
  }

  return contents;
}

export function makeDescription(): Context {
  return {
    name: "Description",
    getAiSystemPrompt: (character: Character): string =>
      `Write a detailed description for a character named "${character.name}". Do not respond with anything except the descripion.`,
    contents: "",
  };
}

export function makeShortTermGoals(): Context {
  return {
    name: "Short Term Goals",
    getAiSystemPrompt: (character: Character): string =>
      `Look at the current character information and recent chat history, then write a list of short term goals for "${character.name}". Do not respond with anything except the goals.`,
    contents: "",
  };
}
