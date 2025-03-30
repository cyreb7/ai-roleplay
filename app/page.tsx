"use client";

import React, { useState } from "react";
import Chat from "./components/chat";
import AiManager, { AiModel } from "./ai/aiManager";
import ChatMessage from "./ai/chatMessage";
import AiSettings from "./components/aiSettings";
import CharacterSettings from "./components/characterSettings";
import Character from "./ai/character";

export default function Home() {
  const [messageHistory, setMessages] = useState<ChatMessage[]>([]);
  const [chatAiManager, setChatAiManager] = useState<AiManager>(
    new AiManager(),
  );
  const [aiCharacter] = useState<Character>(new Character("Agent"));
  const [playerCharacter] = useState<Character>(new Character("Player"));

  async function sendMessage(message: string) {
    const newMessage = chatAiManager.makeMessage(message, playerCharacter);
    messageHistory.push(newMessage);
    const responseMessage = await chatAiManager.sendMessage(
      messageHistory,
      aiCharacter,
    );
    setMessages([...messageHistory, responseMessage]);
  }

  function updateModel(model: AiModel) {
    chatAiManager.model = model;
    setChatAiManager(chatAiManager);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Chat messages={messageHistory} sendMessage={sendMessage} />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <CharacterSettings title="AI Settings" character={aiCharacter} />
        <CharacterSettings
          title="Player Settings"
          character={playerCharacter}
        />
        <AiSettings
          title="Chat AI Settings"
          aiManager={chatAiManager}
          updateModel={updateModel}
        />
      </footer>
    </div>
  );
}
