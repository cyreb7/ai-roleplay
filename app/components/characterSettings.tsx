"use client";

import React from "react";
import { Context } from "../ai/context";
import ContextSettings from "./contextSettings";

interface CharacterProps {
  title: string;
  characterName: string;
  characterTraits: Context[];
  onNameChange: (name: string) => void;
  onNewContents: (context: Context, newContents: string) => void;
  onGenerateContents: (context: Context) => void;
}

export default function CharacterSettings({
  title,
  characterName,
  characterTraits,
  onNameChange,
  onNewContents,
  onGenerateContents,
}: CharacterProps) {
  return (
    <div className="p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="mb-4">
        <label htmlFor="characterName" className="block text-sm font-medium">
          Name:
        </label>
        <input
          type="text"
          id="characterName"
          value={characterName}
          onChange={(e) => onNameChange(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Character name..."
        />
      </div>

      {characterTraits.map((trait: Context) => (
        <ContextSettings
          key={trait.name}
          title={trait.name}
          contents={trait.contents}
          generating={trait.generating}
          onGenerate={() => onGenerateContents(trait)}
          onNewContents={(contents) => onNewContents(trait, contents)}
        />
      ))}
    </div>
  );
}
