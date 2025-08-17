"use client";

import React, { useEffect, useState } from "react";
import AiManager, { AiModel } from "../ai/aiManager";

interface AiManagerProps {
  title: string;
  aiManager: AiManager;
  updateModel: (modelId: AiModel) => void;
  updateSystemPrompt: (systemPrompt: string) => void;
}

export default function AiSettings({
  title,
  aiManager,
  updateModel,
  updateSystemPrompt,
}: AiManagerProps) {
  const DEFAULT_MODEL = "gemma3:4b";
  const [availableModels, setAvailableModels] = useState<AiModel[]>([
    { name: "Loading..." } as AiModel,
  ]);
  const [selectedModel, setSelectedModel] = useState<string>(
    availableModels[0].name,
  );

  useEffect(() => {
    updateModels();
  }, [aiManager]);

  async function updateModels() {
    const models = await aiManager.getAllModels();
    setAvailableModels(models);

    const defaultModel =
      models.find((m) => m.name === DEFAULT_MODEL) ?? models[0];
    handleModelChange(defaultModel.name);
  }

  function handleModelChange(modelName: string) {
    setSelectedModel(modelName);
    updateModel({ name: modelName });
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="mb-4">
        <label htmlFor="modelSelect">Choose AI Model:</label>
        <select
          id="modelSelect"
          value={selectedModel}
          onChange={(e) => handleModelChange(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {availableModels.map((model) => (
            <option key={model.name} value={model.name} className="text-black">
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="systemPrompt">System Prompt:</label>
        <textarea
          id="systemPrompt"
          value={aiManager.systemPrompt ?? ""}
          onChange={(e) => updateSystemPrompt(e.target.value)}
          placeholder="Enter system prompt..."
          className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows={4}
        />
      </div>
    </div>
  );
}
