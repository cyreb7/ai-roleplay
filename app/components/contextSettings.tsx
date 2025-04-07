"use client";

import React, { useId, useState } from "react";
import Context from "../ai/context";

interface ContextProps {
  trait: Context;
}

export default function ContextSettings({ trait }: ContextProps) {
  const [contents, setContents] = useState(trait.contents);
  const id = useId();

  function handleContentsChange(content: string) {
    setContents(content);
    trait.contents = content;
  }

  async function generateText() {
    setContents("...");

    let newContent = "";
    for await (const part of trait.update()) {
      newContent += part;
      setContents(newContent);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      generateText();
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium">
        {trait.name}
      </label>
      <textarea
        id={id}
        value={contents}
        onChange={(e) => handleContentsChange(e.target.value)}
        onKeyDown={handleKeyPress}
        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      ></textarea>
      <button
        className="mt-1 bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={generateText}
      >
        Generate
      </button>
    </div>
  );
}
