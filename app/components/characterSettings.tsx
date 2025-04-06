"use client";

import React, { useState } from "react";
import Character from "../ai/character";
import AiManager from "../ai/aiManager";
import Context from "../ai/context/context";
import ContextSettings from "./contextSettings";

interface CharacterProps {
  title: string;
  character: Character;
  aiManager: AiManager;
}

export default function CharacterSettings({
  title,
  character,
}: CharacterProps) {
  const [name, setName] = useState(character.name);

  function handleNameChange(newName: string) {
    setName(newName);
    character.name = newName;
  }

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
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      {character.traits.map((trait: Context) => (
        <ContextSettings key={trait.name} trait={trait} />
      ))}
    </div>
  );
}
