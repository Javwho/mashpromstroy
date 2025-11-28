// src/components/common/SectionTitle.jsx
import React from "react";

export function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center max-w-3xl mx-auto my-10 px-2">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight break-words uppercase">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-600 mt-2 break-words">{subtitle}</p>
      )}
    </div>
  );
}
