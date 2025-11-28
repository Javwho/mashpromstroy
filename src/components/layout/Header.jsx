// src/components/layout/Header.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Phone,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONFIG } from "@/config/config";
import { GASES } from "@/data/gases";
import { SOLUTIONS } from "@/data/solutions";
import { SERVICES } from "@/data/services";
import { EQUIPMENT } from "@/data/equipment";

// Локальный helper
function classNames(...a) {
  return a.filter(Boolean).join(" ");
}

// Dropdown (скопирован из исходного App.jsx, чуть подчищен)
function Dropdown({ label, items, onSelect, open, setOpen, onNavigate, active }) {
  const ref = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 260 });
  const [isMobile, setIsMobile] = useState(false);
  const [hovering, setHovering] = useState(false);
  const hoverTimer = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    function outside(e) {
      if (open && ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open, setOpen]);

  useEffect(() => {
    function esc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [setOpen]);

  const computePos = () => {
    if (!ref.current || typeof window === "undefined") return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const max = Math.min(340, vw - 16);
    const width = Math.min(Math.max(rect.width, 260), max);
    const left = Math.min(rect.left, vw - width - 8);
    const top = rect.top + rect.height + 8;
    setMenuPos({ top, left, width });
  };

  const openMenu = () => {
    computePos();
    setOpen(true);
  };
  const closeMenu = () => setOpen(false);

  const onMouseEnter = () => {
    if (isMobile) return;
    setHovering(true);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    openMenu();
  };
  const onMouseLeave = () => {
    if (isMobile) return;
    setHovering(false);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      if (!hovering) closeMenu();
    }, 120);
  };

  const onButtonClick = () => {
    if (!open) {
      // первый тап/клик — просто открыть меню
      openMenu();
    } else {
      // второй тап/клик по заголовку — закрыть меню и перейти
      closeMenu();
      onNavigate?.();
    }
  };

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Button
        variant="ghost"
        className={classNames(
          "hover:text-sky-700",
          active ? "text-sky-700 font-medium" : "text-slate-800"
        )}
        onClick={onButtonClick}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-current={active ? "page" : undefined}
      >
        {label}
        <ChevronDown className="w-4 h-4 ml-1" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="fixed z-50 rounded-xl border border-sky-100 bg-white/95 backdrop-blur shadow-lg overflow-hidden"
            style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
            role="menu"
          >
            <div className="rounded-xl overflow-hidden">
              <div className="flex flex-col p-2 max-h-96 overflow-y-auto">
                {items.map((it, idx) => (
                  <div
                    key={it.id || it.key || it.name || idx}
                    className="w-full px-3 py-2 rounded-lg hover:bg-sky-50"
                    role="menuitem"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelect?.(it, undefined);
                        closeMenu();
                      }}
                      className="text-left w-full"
                    >
                      <div className="text-sm font-medium break-words whitespace-normal leading-snug uppercase">
                        {it.name || it.title}
                      </div>
                      {it.items && (
                        <div className="text-xs text-slate-600 break-words whitespace-normal leading-snug">
                          {Array.isArray(it.items) ? it.items.join(" • ") : it.items}
                        </div>
                      )}
                      {it.description && !it.items && (
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          {it.description}
                        </div>
                      )}
                    </button>

                    {Array.isArray(it.variants) && it.variants.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {it.variants.map((v) => (
                          <button
                            key={v.id || v.label}
                            onClick={() => {
                              onSelect?.(it, v.label);
                              closeMenu();
                            }}
                            className="px-2 py-1 text-xs rounded-md border border-sky-200 hover:bg-sky-100 text-sky-700"
                            aria-label={`${it.name} — ${v.label}`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header({
  route,
  setRoute,
  openMenuState,
  setOpenMenuState,
  mobileNavOpen,
  setMobileNavOpen,
  startOrderFromGas,
  openGasPage,
  openSolutionPage,
  openServicePage,
  openEquipmentPage,
}) {
  const navBtnClass = (isActive) =>
    classNames(
      "hover:text-sky-700",
      isActive ? "text-sky-700 font-medium" : "text-slate-800"
    );

  const closeMobile = () => setMobileNavOpen(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-sky-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            setOpenMenuState(null);
            setMobileNavOpen(false);
            setRoute("home");
          }}
          className="group flex items-center gap-3 min-w-0 cursor-pointer"
          aria-label="На главную"
          title="На главную"
        >
          <img
            src="/logo.png"
            alt="Машпромстрой"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-sm bg-white/0 flex-shrink-0 transition-transform group-hover:scale-[1.03]"
          />
          <div className="min-w-0 text-left">
            <div className="font-semibold leading-tight truncate group-hover:text-sky-700 uppercase">
              {CONFIG.BRAND}
            </div>
            <div className="text-xs text-slate-500 leading-tight truncate">
              {CONFIG.SLOGAN}
            </div>
          </div>
        </button>

        {/* Телефон справа */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href={CONFIG.PHONE_TEL}
            className="px-2 py-1 rounded-md border border-sky-200 text-sky-700 hover:bg-sky-50"
          >
            {CONFIG.PHONE_DISPLAY}
          </a>
        </div>

        {/* Burger (mobile) */}
        <div className="sm:hidden">
          <Button
            variant="ghost"
            aria-label="Меню"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="hover:text-sky-700"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Top nav (desktop) */}
      <div className="max-w-6xl mx-auto px-1 sm:px-4 pb-2">
        <nav className="hidden sm:flex items-center gap-1">
          <Button
            variant="ghost"
            className={navBtnClass(route === "home")}
            onClick={() => {
              setOpenMenuState(null);
              setRoute("home");
            }}
            aria-current={route === "home" ? "page" : undefined}
          >
            Главная
          </Button>

          {/* Газы и смеси */}
          <Dropdown
            label="Газы и смеси"
            items={GASES}
            onSelect={(item, variantLabel) => {
              if (variantLabel) {
                startOrderFromGas(item, variantLabel);
              } else {
                openGasPage(item);
              }
            }}
            open={openMenuState === "gases"}
            setOpen={(v) => setOpenMenuState(v ? "gases" : null)}
            onNavigate={() => {
              setOpenMenuState(null);
              setRoute("gases");
            }}
            active={route === "gases"}
          />

          {/* Решения */}
          <Dropdown
            label="Готовые решения"
            items={SOLUTIONS}
            onSelect={(item, variant) => openSolutionPage(item, variant)}
            open={openMenuState === "solutions"}
            setOpen={(v) => setOpenMenuState(v ? "solutions" : null)}
            onNavigate={() => {
              setOpenMenuState(null);
              setRoute("solutions");
            }}
            active={route === "solutions"}
          />

          {/* Услуги */}
          <Dropdown
            label="Услуги"
            items={SERVICES}
            onSelect={(item) => openServicePage(item)}
            open={openMenuState === "services"}
            setOpen={(v) => setOpenMenuState(v ? "services" : null)}
            onNavigate={() => {
              setOpenMenuState(null);
              setRoute("services");
            }}
            active={route === "services"}
          />

          {/* Оборудование */}
          <Dropdown
            label="Оборудование"
            items={EQUIPMENT}
            onSelect={(item) => openEquipmentPage(item)}
            open={openMenuState === "equipment"}
            setOpen={(v) => setOpenMenuState(v ? "equipment" : null)}
            onNavigate={() => {
              setOpenMenuState(null);
              setRoute("equipment");
            }}
            active={route === "equipment" || route === "equipment-details"}
          />

          <Button
            variant="ghost"
            className={navBtnClass(route === "contacts")}
            onClick={() => {
              setOpenMenuState(null);
              setRoute("contacts");
            }}
            aria-current={route === "contacts" ? "page" : undefined}
          >
            Контакты
          </Button>
        </nav>
      </div>

      {/* Mobile nav (burger panel) */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full bg-white z-40 border-b border-sky-100 shadow"
          >
            <div className="flex flex-col p-3 space-y-1">
              <Button
                variant="ghost"
                onClick={() => {
                  setRoute("home");
                  closeMobile();
                }}
              >
                Главная
              </Button>

              <Dropdown
                label="Газы"
                items={GASES}
                onSelect={(item, variantLabel) => {
                  if (variantLabel) {
                    startOrderFromGas(item, variantLabel);
                  } else {
                    openGasPage(item);
                  }
                  closeMobile();
                }}
                open={openMenuState === "gases-mobile"}
                setOpen={(v) => setOpenMenuState(v ? "gases-mobile" : null)}
              />

              <Dropdown
                label="Готовые решения"
                items={SOLUTIONS}
                onSelect={(item, variant) => {
                  openSolutionPage(item, variant);
                  closeMobile();
                }}
                open={openMenuState === "solutions-mobile"}
                setOpen={(v) => setOpenMenuState(v ? "solutions-mobile" : null)}
              />

              <Dropdown
                label="Услуги"
                items={SERVICES}
                onSelect={(item) => {
                  openServicePage(item);
                  closeMobile();
                }}
                open={openMenuState === "services-mobile"}
                setOpen={(v) => setOpenMenuState(v ? "services-mobile" : null)}
              />

              <Dropdown
                label="Оборудование"
                items={EQUIPMENT}
                onSelect={(item) => {
                  openEquipmentPage(item);
                  closeMobile();
                }}
                open={openMenuState === "equipment-mobile"}
                setOpen={(v) => setOpenMenuState(v ? "equipment-mobile" : null)}
              />

              <Button
                variant="ghost"
                onClick={() => {
                  setRoute("contacts");
                  closeMobile();
                }}
              >
                Контакты
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
