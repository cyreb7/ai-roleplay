"use client";

import React, { useState } from "react";
import Chat from "./components/chat";
import AiManager, { AiModel } from "./ai/aiManager";
import AiSettings from "./components/aiSettings";
import CharacterSettings from "./components/characterSettings";
import Character from "./ai/character";
import ChatMessage from "./ai/chatMessage";

export default function Home() {
  const [chatAiManager, setChatAiManager] = useState<AiManager>(
    new AiManager(),
  );
  const [generateAiManager, setGenerateAiManager] = useState<AiManager>(
    new AiManager(),
  );
  const [aiCharacter] = useState<Character>(
    new Character("Agent", generateAiManager),
  );
  const [playerCharacter] = useState<Character>(
    new Character("Player", generateAiManager),
  );
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  async function sendMessage(message: string) {
    const newMessage = chatAiManager.makeMessage(message, playerCharacter);
    chatHistory.push(newMessage);
    const responseMessage = await chatAiManager.sendMessage(
      chatHistory,
      [playerCharacter],
      aiCharacter,
    );
    setChatHistory([...chatHistory, responseMessage]);

    aiCharacter.updateContext();
    playerCharacter.updateContext();
  }

  function updateChatModel(model: AiModel) {
    chatAiManager.model = model;
    setChatAiManager(chatAiManager);
  }

  function updateGenerateModel(model: AiModel) {
    generateAiManager.model = model;
    setGenerateAiManager(generateAiManager);
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
          character={aiCharacter}
          aiManager={generateAiManager}
        />
        <CharacterSettings
          title="Player Settings"
          character={playerCharacter}
          aiManager={generateAiManager}
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
