"use client";

import React, { useState } from "react";
import MessageHistory from "./messageHistory";
import ChatMessage from "../ai/chatMessage";
import GeneratingButton from "./generatingButton";

interface ChatProps {
  chatHistory: ChatMessage[];
  sendMessage: (message: string) => void;
}

export default function Chat({ chatHistory, sendMessage }: ChatProps) {
  const [input, setInput] = useState("");
  const isGenerating = chatHistory.some((message) => message.generating);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    const trimmedInput = input.trim();
    if (trimmedInput) {
      sendMessage(trimmedInput);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="w-xl text-justify text-pretty hyphens-auto">
      <div className="flex flex-col space-y-4">
        <MessageHistory chatHistory={chatHistory} />
      </div>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="p-2 border rounded"
          placeholder="Message..."
          disabled={isGenerating}
        />
        <GeneratingButton onClick={handleSendMessage} generating={isGenerating}>
          Send
        </GeneratingButton>
      </div>
    </div>
  );
}
