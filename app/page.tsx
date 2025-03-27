"use client";

import React, { useState } from "react";
import Chat from "./Chat";

export default function Home() {
  const [messageHistory, setMessages] = useState<string[]>([]);

  const sendMessage = (message: string) => {
    alert(`Sending message ${message}`);
    setMessages([...messageHistory, message]);
    return Promise.resolve();
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Chat messages={messageHistory} sendMessage={sendMessage} />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p>Have Fun!</p>
      </footer>
    </div>
  );
}
