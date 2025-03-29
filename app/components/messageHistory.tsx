import React from "react";
import ChatMessage from "../ai/chatMessage";
import Message from "./message";

interface MessageHistoryProps {
  messages: ChatMessage[];
}

export default function MessageHistory({ messages }: MessageHistoryProps) {
  return (
    <ol className="bg-blue p-4 rounded shadow-md divide-y divide-gray-200">
      {messages.map((message, index) => (
        <li key={index} className="py-3 flex items-center space-x-4">
          <Message message={message} />
        </li>
      ))}
    </ol>
  );
}
