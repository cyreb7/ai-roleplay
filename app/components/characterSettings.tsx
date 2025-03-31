"use client";

import React, { useState } from "react";
import Character from "../ai/character";
import AiTextArea from "./aiTextArea";
import AiManager from "../ai/aiManager";

interface CharacterProps {
  title: string;
  character: Character;
  aiManager: AiManager;
}

export default function CharacterSettings({
  title,
  character,
  aiManager,
}: CharacterProps) {
  const [name, setName] = useState(character.name);

  function handleNameChange(newName: string) {
    setName(newName);
    character.name = newName;
  }

  function handleDescriptionChange(newDescription: string) {
    character.description = newDescription;
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
      <AiTextArea
        label="Description:"
        aiSystemPrompt={`Write a detailed description for a character named "${name}". Do not respond with anything except the descripion.`}
        handleContentsUpdate={handleDescriptionChange}
        aiManager={aiManager}
      />
    </div>
  );
}
