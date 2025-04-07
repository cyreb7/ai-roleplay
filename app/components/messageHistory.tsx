import React from "react";
import Message from "./message";
import ChatMessage from "../ai/chatMessage";

interface MessageHistoryProps {
  chatHistory: ChatMessage[];
}

export default function MessageHistory({ chatHistory }: MessageHistoryProps) {
  return (
    <ol className="bg-blue p-4 rounded shadow-md divide-y divide-gray-200">
      {chatHistory.map((message) => (
        <li key={message.id} className="py-3 flex items-center space-x-4">
          <Message message={message} />
        </li>
      ))}
    </ol>
  );
}
