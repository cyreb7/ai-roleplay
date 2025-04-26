"use client";

import React from "react";

interface GeneratingButtonProps {
  generating: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function GeneratingButton({
  generating,
  onClick,
  children,
}: GeneratingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`mt-1 px-4 p-2 rounded text-white ${generating ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"}`}
      disabled={generating}
    >
      {children}
    </button>
  );
}
