import React from "react";
import ChatMessage from "../ai/chatMessage";

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  function getContents(): string {
    let contents = message.message.content;

    if (message.generating) {
      contents += "…";
    }

    return contents;
  }

  return <div>{getContents()}</div>;
}
