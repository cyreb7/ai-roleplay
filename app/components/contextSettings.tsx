"use client";

import React, { useId } from "react";

interface ContextProps {
  title: string;
  contents: string;
  onGenerate: () => void;
  onNewContents: (contents: string) => void;
}

export default function ContextSettings({
  title,
  contents,
  onGenerate,
  onNewContents,
}: ContextProps) {
  const id = useId();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      onGenerate();
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium">
        {title}
      </label>
      <textarea
        id={id}
        value={contents}
        onChange={(e) => onNewContents(e.target.value)}
        onKeyDown={handleKeyPress}
        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      ></textarea>
      <button
        className="mt-1 bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={onGenerate}
      >
        Generate
      </button>
    </div>
  );
}
