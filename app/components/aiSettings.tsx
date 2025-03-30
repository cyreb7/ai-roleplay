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
    setSelectedModel(models[0].name);
    updateModel(models[0]);
  }

  function handleModelChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = event.target.value;
    setSelectedModel(selectedId);
    updateModel({ name: selectedId });
  }

  return (
    <div>
      <h2>{title}</h2>
      <label htmlFor="modelSelect">Choose AI Model:</label>
      <select
        id="modelSelect"
        value={selectedModel}
        onChange={handleModelChange}
      >
        {avalibleModels.map((model) => (
          <option key={model.name} value={model.name}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}
