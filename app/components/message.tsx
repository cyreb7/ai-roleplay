import React from "react";
import ChatMessage from "../ai/chatMessage";

interface MessageyProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageyProps) {
  function getContents(): string {
    let contents = message.message.content;

    if (message.generating) {
      contents += "…";
    }

    return contents;
  }

  return <div>{getContents()}</div>;
}
