"use client";

import React, { useState } from "react";
import Character from "../ai/character";

interface CharacterProps {
  character: Character;
}

export default function CharacterSettings({ character }: CharacterProps) {
  const [name, setName] = useState(character.name);
  const [description, setDescription] = useState(character.description ?? "");

  function handleNameChange(newName: string) {
    setName(newName);
    character.name = newName;
  }

  function handleDescriptionChange(newDescription: string) {
    setDescription(newDescription);
    character.description = newDescription;
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Character Settings</h2>
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
      <div className="mb-4">
        <label
          htmlFor="characterDescription"
          className="block text-sm font-medium"
        >
          Description:
        </label>
        <textarea
          id="characterDescription"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
      </div>
    </div>
  );
}
