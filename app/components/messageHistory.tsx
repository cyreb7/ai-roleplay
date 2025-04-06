import React from "react";
import Message from "./message";
import ChatRoom from "../ai/chatRoom";

interface MessageHistoryProps {
  room: ChatRoom;
}

export default function MessageHistory({ room }: MessageHistoryProps) {
  return (
    <ol className="bg-blue p-4 rounded shadow-md divide-y divide-gray-200">
      {room.messages.map((message, index) => (
        <li key={index} className="py-3 flex items-center space-x-4">
          <Message message={message} />
        </li>
      ))}
    </ol>
  );
}
