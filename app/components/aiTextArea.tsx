"use client";

import React, { useId, useState } from "react";
import AiManager from "../ai/aiManager";

interface AiTextAreaProps {
  label: string;
  aiSystemPrompt: string;
  handleContentsUpdate: (content: string) => void;
  aiManager: AiManager;
}

export default function AiTextArea({
  label,
  aiSystemPrompt,
  handleContentsUpdate,
  aiManager,
}: AiTextAreaProps) {
  const [contents, setContents] = useState("");
  const id = useId();

  function handleContentsChange(content: string) {
    setContents(content);
    handleContentsUpdate(content);
  }

  async function generateText() {
    const context = contents || " ";
    setContents("...");
    const response = await aiManager.generate(context, aiSystemPrompt);

    let newContent = "";
    for await (const part of response) {
      newContent += part.response;
      setContents(newContent);
    }
    handleContentsUpdate(newContent);
  }

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        value={contents}
        onChange={(e) => handleContentsChange(e.target.value)}
        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      ></textarea>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={generateText}
      >
        Generate
      </button>
    </div>
  );
}
