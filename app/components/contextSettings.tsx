"use client";

import React, { useId } from "react";

interface ContextProps {
  title: string;
  contents: string;
  generating: boolean;
  onGenerate: () => void;
  onNewContents: (contents: string) => void;
}

export default function ContextSettings({
  title,
  contents,
  generating,
  onGenerate,
  onNewContents,
}: ContextProps) {
  const id = useId();

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      onGenerate();
    }
  }

  function getContents() {
    if (generating) {
      return contents + "...";
    }

    return contents;
  }

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium">
        {title}
      </label>
      <textarea
        id={id}
        value={getContents()}
        onChange={(e) => onNewContents(e.target.value)}
        onKeyDown={handleKeyPress}
        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        disabled={generating}
      ></textarea>
      <button
        className={`mt-1 px-4 py-2 rounded mr-2 text-white ${generating ? "bg-gray-500" : "bg-blue-500"}`}
        onClick={onGenerate}
        disabled={generating}
      >
        Generate
      </button>
    </div>
  );
}
