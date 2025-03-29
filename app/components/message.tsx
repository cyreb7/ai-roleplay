import React, { useState } from "react";
import ChatMessage from "../ai/chatMessage";

interface MessageyProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageyProps) {
  const [messageContent, setInput] = useState(message.content);

  async function awaitMessageDone(): Promise<void> {
    if (!message.done) {
      return;
    }

    for await (const part of message.done) {
      setInput(part.content);
    }
  }

  awaitMessageDone();

  return <div>{messageContent}</div>;
}
