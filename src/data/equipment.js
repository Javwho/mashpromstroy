// src/data/equipment.js

export const EQUIPMENT = [
  {
    id: "eq-gauges",
    name: "Манометры",
    items: "Корпуса, классы точности, резьбы",
  },
  {
    id: "eq-ramps",
    name: "Газоразрядные рампы",
    items: "Односторонние/двусторонние, с автоматикой",
  },
  {
    id: "eq-cylinders",
    name: "Баллоны",
    items: "5/10/25/40/50 л, резьбы, аттестация",
  },
  {
    id: "eq-storage",
    name: "Системы хранения",
    items: "Комплексы хранения и подачи",
    variants: [
      { id: "storage-monoblocks", label: "Моноблоки" },
      { id: "storage-cryocyl", label: "Криоцилиндры" },
      { id: "storage-tanks", label: "Стационарные ёмкости" },
    ],
  },
];
