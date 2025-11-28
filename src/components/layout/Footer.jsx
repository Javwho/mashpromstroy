// src/components/layout/Footer.jsx

import React from "react";
import { Check } from "lucide-react";
import { CONFIG } from "@/config/config";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-sky-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 text-xs text-slate-500 flex flex-wrap gap-2 items-center justify-between">
        <div>
          © {new Date().getFullYear()} {CONFIG.BRAND}. Все права защищены.
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          Сделано аккуратно и без визуального шума
        </div>
      </div>
    </footer>
  );
}
