"use client";

import React, { useState } from "react";
import Chat from "./components/chat";
import AiManager, { AiModel } from "./ai/aiManager";
import AiSettings from "./components/aiSettings";
import CharacterSettings from "./components/characterSettings";
import ChatMessage from "./ai/chatMessage";
import { Character } from "./ai/character";
import { Context, makeDescription, makeShortTermGoals } from "./ai/context";

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
    privateContext: [makeShortTermGoals()],
  });
  const [playerCharacter, setPlayerCharacter] = useState<Character>({
    name: "Player",
    publicContext: [makeDescription()],
    privateContext: [],
  });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  function sendMessage(message: string) {
    const newMessage = chatAiManager.makeMessage(message, playerCharacter);
    chatHistory.push(newMessage);
    const responseMessage = chatAiManager.sendMessage(
      chatHistory,
      [playerCharacter],
      aiCharacter,
    );
    setChatHistory([...chatHistory, responseMessage]);
  }

  function updateChatModel(model: AiModel) {
    chatAiManager.model = model;
    setChatAiManager(chatAiManager);
  }

  function updateGenerateModel(model: AiModel) {
    generateAiManager.model = model;
    setGenerateAiManager(generateAiManager);
  }

  async function generate(
    context: Context,
    character: Character,
    setCharacter: (character: Character) => void,
  ) {
    context.generating = true;
    setCharacter({ ...character });

    const response = await generateAiManager.generate(
      context.contents,
      context.getAiSystemPrompt(character),
    );

    context.contents = "";
    for await (const part of response) {
      context.contents += part.response;
      setCharacter({ ...character });
    }

    context.generating = false;
    setCharacter({ ...character });
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
            generate(context, aiCharacter, setAiCharacter)
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
            generate(context, playerCharacter, setPlayerCharacter)
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
