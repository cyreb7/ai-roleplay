"use client";

import React, { useEffect, useState } from "react";
import AiManager, { AiModel } from "../ai/aiManager";

interface AiManagerProps {
  title: string;
  aiManager: AiManager;
  updateModel: (modelId: AiModel) => void;
}

export default function AiSettings({
  title,
  aiManager,
  updateModel,
}: AiManagerProps) {
  const DEFAULT_MODEL = "gemma3:4b";
  const [avalibleModels, setAvalibleModels] = useState<AiModel[]>([
    { name: "Loading..." } as AiModel,
  ]);
  const [selectedModel, setSelectedModel] = useState<string>(
    avalibleModels[0].name,
  );

  useEffect(() => {
    updateModels();
  }, [aiManager]);

  async function updateModels() {
    const models = await aiManager.getAllModesl();
    setAvalibleModels(models);

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
          {avalibleModels.map((model) => (
            <option key={model.name} value={model.name} className="text-black">
              {model.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
