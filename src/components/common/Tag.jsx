// src/components/common/Tag.jsx
import React from "react";

export function Tag({ children }) {
  return (
    <span className="text-xs rounded-full px-2 py-1 bg-sky-100/60 text-sky-700 border border-sky-200 break-words">
      {children}
    </span>
  );
}
