"use client";

import React, { useState } from "react";
import Chat from "./components/chat";
import AiManager, { AiModel } from "./ai/aiManager";
import AiSettings from "./components/aiSettings";
import CharacterSettings from "./components/characterSettings";
import ChatMessage from "./ai/chatMessage";
import { Character } from "./ai/character";
import {
  Context,
  makeDescription,
  makeLongTermGoals,
  makeShortTermGoals,
} from "./ai/context";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [chatAiManager, setChatAiManager] = useState<AiManager>(
    new AiManager(),
  );
  const [generateAiManager, setGenerateAiManager] = useState<AiManager>(
    new AiManager(),
  );
  const [aiCharacter, setAiCharacter] = useState<Character>({
    name: "Agent",
    publicContext: [makeDescription()],
    privateContext: [makeShortTermGoals(), makeLongTermGoals()],
  });
  const [playerCharacter, setPlayerCharacter] = useState<Character>({
    name: "Player",
    publicContext: [makeDescription()],
    privateContext: [],
  });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  async function sendMessage(playerMessageContent: string) {
    const thisChatHistory = chatHistory;
    const newPlayerMessage: ChatMessage = {
      message: {
        role: "user",
        content: playerMessageContent,
      },
      character: playerCharacter,
      generating: false,
      id: uuidv4(),
    };

    thisChatHistory.push(newPlayerMessage);

    const newAiMessage = {
      message: {
        role: "assistant",
        content: "",
      },
      character: aiCharacter,
      generating: true,
      id: uuidv4(),
    };

    setChatHistory([...thisChatHistory, newAiMessage]);

    try {
      const response = await chatAiManager.sendMessage(
        chatHistory,
        [playerCharacter],
        aiCharacter,
      );

      let lastPart;
      for await (const part of response) {
        lastPart = part;
        newAiMessage.message.content += part.message.content;
        setChatHistory([...thisChatHistory, newAiMessage]);
      }
      console.debug("Finished generating message", lastPart);
      newAiMessage.generating = false;
      setChatHistory([...thisChatHistory, newAiMessage]);
    } catch (e) {
      setChatHistory([...thisChatHistory]);
      throw e;
    }

    const updatedChatHistory = [...thisChatHistory, newAiMessage];
    generateContextOnNewMessage(
      aiCharacter,
      setAiCharacter,
      updatedChatHistory,
    );
    generateContextOnNewMessage(
      playerCharacter,
      setPlayerCharacter,
      updatedChatHistory,
    );
  }

  function updateChatModel(model: AiModel) {
    chatAiManager.model = model;
    setChatAiManager(chatAiManager);
  }

  function updateGenerateModel(model: AiModel) {
    generateAiManager.model = model;
    setGenerateAiManager(generateAiManager);
  }

  async function generateContextOnNewMessage(
    character: Character,
    setCharacter: (character: Character) => void,
    chatHistory: ChatMessage[],
  ) {
    for (const context of [
      ...character.privateContext,
      ...character.publicContext,
    ].filter((context) => context.getGenerateOnNewMessageUserPrompt !== null)) {
      const prompt = context.getGenerateOnNewMessageUserPrompt!(chatHistory);
      generateContext(prompt, context, character, setCharacter);
    }
  }

  async function generateContext(
    prompt: string,
    context: Context,
    character: Character,
    setCharacter: (character: Character) => void,
  ) {
    const originalContents = context.contents;
    context.generating = true;
    setCharacter({ ...character });

    try {
      const response = await generateAiManager.generate(
        prompt,
        context.getAiSystemPrompt(character),
      );

      context.contents = "";
      let lastPart;
      for await (const part of response) {
        lastPart = part;
        context.contents += part.response;
        setCharacter({ ...character });
      }
      console.debug("Finished generating context", {
        ...lastPart,
        response: context.contents,
      });
    } catch (error) {
      context.contents = originalContents;
      throw error;
    } finally {
      context.generating = false;
      setCharacter({ ...character });
    }
  }

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Chat chatHistory={chatHistory} sendMessage={sendMessage} />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <CharacterSettings
          title="AI Settings"
          characterName={aiCharacter.name}
          characterTraits={[
            ...aiCharacter.publicContext,
            ...aiCharacter.privateContext,
          ]}
          onNameChange={function (name) {
            aiCharacter.name = name;
            setAiCharacter({ ...aiCharacter });
          }}
          onNewContents={(context, newContents) => {
            context.contents = newContents;
            setAiCharacter({ ...aiCharacter });
          }}
          onGenerateContents={(context) =>
            generateContext(
              context.contents,
              context,
              aiCharacter,
              setAiCharacter,
            )
          }
        />
        <CharacterSettings
          title="Player Settings"
          characterName={playerCharacter.name}
          characterTraits={[
            ...playerCharacter.publicContext,
            ...playerCharacter.privateContext,
          ]}
          onNameChange={function (name) {
            playerCharacter.name = name;
            setPlayerCharacter({ ...playerCharacter });
          }}
          onNewContents={(context, newContents) => {
            context.contents = newContents;
            setPlayerCharacter({ ...playerCharacter });
          }}
          onGenerateContents={(context) =>
            generateContext(
              context.contents,
              context,
              playerCharacter,
              setPlayerCharacter,
            )
          }
        />
        <AiSettings
          title="Chat AI Settings"
          aiManager={chatAiManager}
          updateModel={updateChatModel}
        />
        <AiSettings
          title="Generation AI"
          aiManager={generateAiManager}
          updateModel={updateGenerateModel}
        />
      </footer>
    </div>
  );
}
