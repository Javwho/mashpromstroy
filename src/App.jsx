import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Factory,
  Shield,
  Leaf,
  Truck,
  Wrench,
  FlaskConical,
  Droplets,
  MapPin,
  Check,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ===================== CONFIG =====================
import { CONFIG, TG } from "./config/config";

// ===================== ДАННЫЕ =====================
import { GASES } from "./data/gases";
import { SOLUTIONS } from "./data/solutions";
import { SERVICES } from "./data/services";
import { EQUIPMENT } from "./data/equipment";

// ===================== ЗАКАЗ: СПРАВОЧНЫЕ ДАННЫЕ =====================
const CYLINDER_SIZES = [5, 10, 25, 40, 50];

const OWNERSHIP = [
  { id: "own", label: "Мой баллон" },
  { id: "rent", label: "Баллон компании" },
];

const DELIVERY = [
  { id: "pickup", label: "Самовывоз" },
  { id: "delivery", label: "Доставка" },
];

// ===================== UI HELPERS =====================
import { classNames } from "./lib/utils";
import { Tag } from "./components/common/Tag";

function Cylinder({ size, selected, onClick }) {
  const height = useMemo(() => 140 + (size - 5) * 2, [size]);
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group min-w-[68px]"
    >
      <svg
        width="80"
        height={height}
        viewBox={`0 0 80 ${height}`}
        className="drop-shadow-sm"
      >
        <ellipse
          cx="40"
          cy={height - 6}
          rx="28"
          ry="6"
          className="fill-slate-300/30"
        />
        <defs>
          <linearGradient id={`grad-${size}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopOpacity="0.9" stopColor="#BAE6FD" />
            <stop offset="100%" stopOpacity="0.6" stopColor="#7DD3FC" />
          </linearGradient>
        </defs>
        <rect
          x="16"
          y="20"
          width="48"
          height={height - 40}
          rx="24"
          fill={`url(#grad-${size})`}
          opacity="0.8"
          stroke="#0369a1"
        />
        <rect x="30" y="6" width="20" height="20" rx="4" fill="#0369a1" />
        <rect x="22" y="0" width="36" height="12" rx="6" fill="#0ea5e9" />
        {selected && (
          <rect
            x="14"
            y="18"
            width="52"
            height={height - 36}
            rx="26"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
          />
        )}
      </svg>
      <span
        className={classNames(
          "text-sm",
          selected ? "text-sky-700 font-medium" : "text-slate-600"
        )}
      >
        {size} л
      </span>
    </button>
  );
}

function InfoStrip() {
  const items = [
    {
      key: "safety",
      icon: Shield,
      color: "#C0C0C0",
      title: "Безопасность",
      text: "Сертифицированные газы и тара, соблюдение ГОСТ",
    },
    {
      key: "reliability",
      icon: Factory,
      color: "#B22222",
      title: "Надёжность",
      text: "Собственная логистика и сервис",
    },
    {
      key: "eco",
      icon: Leaf,
      color: "#16a34a",
      title: "Экология",
      text: "Чистые процессы, снижение CO₂",
    },
    {
      key: "service",
      icon: Wrench,
      color: "#6B7280",
      title: "Сервис",
      text: "Подбор решений и пусконаладка",
    },
  ];

  return (
    <div className="mt-6">
      <div className="hidden md:grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Card
              key={it.key}
              className="relative bg-white/70 backdrop-blur border-sky-100 w-full overflow-hidden"
            >
              <CardContent className="pt-8 pb-4 px-4">
                <Icon
                  className="w-4 h-4 absolute top-3 left-3"
                  style={{ color: it.color }}
                />

                <div className="text-[11px] font-semibold uppercase tracking-tight whitespace-nowrap">
                  {it.title}
                </div>

                <div className="text-xs text-slate-600 break-words mt-1">
                  {it.text}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden -mx-1 overflow-x-auto">
        <div className="flex gap-3 px-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <Card
                key={it.key}
                className="relative bg-white/70 backdrop-blur border-sky-100 min-w-[240px] w-[240px] overflow-hidden"
              >
                <CardContent className="pt-8 pb-4 px-4">
                  <Icon
                    className="w-4 h-4 absolute top-3 left-3"
                    style={{ color: it.color }}
                  />

                  <div className="text-[11px] font-semibold uppercase tracking-tight whitespace-nowrap">
                    {it.title}
                  </div>

                  <div className="text-xs text-slate-600 break-words mt-1">
                    {it.text}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===================== DROPDOWN =====================
function Dropdown({
  label,
  items,
  onSelect,
  open,
  setOpen,
  onNavigate,
  active,
}) {
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
      // второй тап/клик по тому же пункту — закрыть меню и перейти
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
                        e.stopPropagation(); // чтобы не сработал клик по заголовку Dropdown
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
                          {Array.isArray(it.items)
                            ? it.items.join(" • ")
                            : it.items}
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); // очень важно: не даём клику уйти «наружу»
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

import { SectionTitle } from "./components/common/SectionTitle";

import { GasConsumptionCalculator } from "@/components/common/GasConsumptionCalculator";

// ===================== EXTRA DATA HELPERS =====================
function getGasExtra(gas) {
  if (!gas) return null;

  switch (gas.id) {
    // ========================== КИСЛОРОД ==========================
    case "o2":
      return {
        heroImage: "/img/gases/oxygen.JPG",
        heroImageAlt: "Баллоны с кислородом",
        heroNote:
          "Кислород в баллонах 40 л, чистота 99.7–99.95%. Подходит для резки и сварки металлов, а также технологических процессов.",
        parameters: [
          { name: "Формула", value: "O₂" },
          { name: "Типовая чистота", value: "99.7–99.95%" },
          {
            name: "Агрегатное состояние",
            value: "Газ (криожидкий при низких температурах)",
          },
          { name: "Температура кипения", value: "≈ −183 °C" },
          {
            name: "Плотность при 0 °C и 1 атм",
            value: "≈ 1.33–1.43 кг/м³",
          },
          { name: "Цвет и запах", value: "Бесцветный, без запаха" },
          {
            name: "Сфера применения",
            value:
              "Медицина, металлургия, сварка/резка, химическое производство",
          },
        ],
        extraApplications: [
          "Кислородно-газовая резка и сварка металлоконструкций",
          "Поддержание горения в печах и плавильных агрегатах",
          "Очистка сточных газов в ряде технологических схем",
          "Кислород для медицинских учреждений (при соответствующей чистоте и регламенте)",
        ],
        safetyNotes: [
          "Кислород сам по себе не горит, но резко усиливает горение — нельзя работать с маслом, жиром и загрязнённой арматурой.",
          "Не допускается контакт кислородной арматуры с нефтепродуктами — риск самовозгорания.",
          "Баллоны хранить вертикально, закреплёнными, вдали от источников тепла и открытого огня.",
          "Запрещено использовать кислород для продувки одежды, помещений и пр.",
        ],
        faq: [
          {
            q: "Чем технический кислород отличается от медицинского?",
            a: "Медицинский кислород имеет более жёсткие требования по чистоте, наличию примесей и по контролю производства. Технический используется в сварке и технологических процессах, но не применяется для дыхания.",
          },
          {
            q: "Можно ли заправить ваш кислород в чужие баллоны?",
            a: "Зависит от состояния и документов на баллон. Обычно необходима действующая аттестация и соответствующая маркировка. Конкретику согласуем при заявке.",
          },
          {
            q: "Какой объём баллона лучше выбрать?",
            a: "Для небольших работ достаточно 10–25 л, для регулярной сварки и производства обычно используют 40–50 л. Мы поможем посчитать расход под вашу задачу.",
          },
          {
            q: "Нужен ли отдельный редуктор под кислород?",
            a: "Да. Для кислорода используют специальную арматуру и редукторы, рассчитанные на работу в кислородной среде, с соответствующей резьбой и материалами.",
          },
        ],
      };

    // ========================== АЗОТ ==========================
    case "n2":
      return {
        heroImage: "/img/gases/nitrogen.JPG",
        heroImageAlt: "Баллоны с азотом",
        heroNote:
          "Азот — инертный газ, применяемый в пищевой промышленности, электронике, упаковке, металлургии и для создания защитной среды.",
        parameters: [
          { name: "Формула", value: "N₂" },
          {
            name: "Стандартная чистота",
            value: "99.9% (тех) / 99.999% (5.0)",
          },
          { name: "Пищевая маркировка", value: "E941" },
          {
            name: "Агрегатное состояние",
            value: "Газ (криожидкий при −196 °C)",
          },
          { name: "Температура кипения", value: "≈ −196 °C" },
          {
            name: "Плотность",
            value: "≈ 1.17 кг/м³ (при 0 °C и 1 атм)",
          },
          { name: "Цвет и запах", value: "Бесцветный, без запаха" },
          {
            name: "Сфера применения",
            value: "Инертная среда, упаковка MAP, электроника, химпром",
          },
        ],
        extraApplications: [
          "Создание инертной атмосферы при сварке, литье и обработке металлов",
          "Очистка и продувка трубопроводов, резервуаров и технологических линий",
          "MAP-упаковка продуктов (мясо, рыба, салаты), предотвращение окисления",
          "Использование в электронике для предотвращения реакции с кислородом",
          "Создание давления в пневмосистемах и гидроаккумуляторах",
          "Криогенное охлаждение и заморозка (в жидком виде)",
        ],
        purityLevels: [
          {
            label: "E941 (пищевой)",
            desc: "Для упаковки продуктов, без запаха, без примесей",
          },
          {
            label: "Технический",
            desc: "99.9%, подходит для продувки и инертной среды",
          },
          {
            label: "5.0 (99.999%)",
            desc: "Высокочистый — для электроники, лабораторий и высокоточных процессов",
          },
        ],
        safetyNotes: [
          "Азот не токсичен, но вытесняет кислород — риск удушья в плохо проветриваемых помещениях.",
          "Жидкий азот вызывает мгновенные ожоги при контакте с кожей.",
          "При работе с жидким азотом необходимы защитные перчатки и очки.",
          "Продувку азотом нельзя направлять на людей или в замкнутые объемы.",
          "Хранить баллоны вертикально, закреплёнными, вдали от тепла.",
        ],
        faq: [
          {
            q: "Что такое пищевой азот E941?",
            a: "E941 — это чистый азот, прошедший пищевую сертификацию. Используется в MAP-упаковке и пищевых технологиях.",
          },
          {
            q: "Можно ли техническим азотом упаковывать продукты?",
            a: "Нет. Для продуктов нужен только E941 — технический азот не проходит пищевую сертификацию.",
          },
        ],
      };

    // ========================== АРГОН ==========================
    case "ar":
      return {
        heroImage: "/img/gases/argon.JPG",
        heroImageAlt: "Баллоны с аргоном",
        heroNote:
          "Аргон — инертный газ для TIG/MIG-сварки и металлургии. Обеспечивает стабильную дугу и защиту шва.",
        parameters: [
          { name: "Формула", value: "Ar" },
          { name: "Типовая чистота", value: "4.6 / 4.8 / 5.0" },
          {
            name: "Агрегатное состояние",
            value: "Газ (криожидкий при −186 °C)",
          },
          { name: "Температура кипения", value: "≈ −186 °C" },
          { name: "Цвет и запах", value: "Бесцветный, без запаха" },
          {
            name: "Сфера применения",
            value: "Сварка TIG/MIG, металлургия, лаборатории",
          },
        ],
        extraApplications: [
          "TIG-сварка нержавейки и алюминия",
          "MIG/MAG-сварка сталей в смесях",
          "Защита расплавов в металлургии",
          "Инертная атмосфера в лабораториях",
        ],
        safetyNotes: [
          "Аргон не токсичен, но вытесняет кислород — нужна вентиляция.",
          "Баллоны хранить вертикально и закреплёнными.",
        ],
        faq: [
          {
            q: "Какую чистоту выбрать?",
            a: "Для стандартной сварки обычно 4.6, для ответственных/тонких работ — 4.8–5.0.",
          },
        ],
      };

    // ========================== CO₂ ==========================
    case "co2":
      return {
        heroImage: "/img/gases/CO2.JPG",
        heroImageAlt: "Баллоны с CO₂",
        heroNote:
          "CO₂ используется для газирования напитков, сварки MAG, огнетушителей и получения сухого льда.",
        parameters: [
          { name: "Формула", value: "CO₂" },
          { name: "Маркировка", value: "E290 (пищ.) / Технический" },
          { name: "Агрегатное состояние", value: "Газ / жидкость при охлаждении" },
          { name: "Температура кипения", value: "≈ −78.5 °C (сублимация)" },
          { name: "Цвет и запах", value: "Бесцветный, без запаха" },
          { name: "Сфера применения", value: "HoReCa, сварка, охлаждение" },
        ],
        extraApplications: [
          "Газирование напитков и пива",
          "Сварка MAG низкоуглеродистых сталей",
          "Сухой лёд и охлаждение",
          "Огнетушители CO₂",
        ],
        safetyNotes: [
          "CO₂ тяжелее воздуха — возможна концентрация у пола, нужна вентиляция.",
          "Не нагревать баллоны и не хранить рядом с источниками тепла.",
        ],
        faq: [
          {
            q: "Чем пищевой CO₂ отличается от технического?",
            a: "Пищевой E290 имеет контроль по примесям и запаху, допускается к контакту с продуктами.",
          },
        ],
      };

    // ========================== ПИЩЕВЫЕ ГАЗЫ ==========================
    case "food":
      return {
        heroImage: "/img/gases/CO2.JPG", // временно — пока нет отдельного фото
        heroImageAlt: "Пищевые газы",
        heroNote:
          "Пищевые газы и смеси CO₂/N₂ для MAP-упаковки, карбонизации и нитро-напитков. Сертификация E290/E941.",
        parameters: [
          { name: "Состав", value: "CO₂ / N₂ / смеси" },
          { name: "Сертификация", value: "E290, E941" },
          { name: "Назначение", value: "MAP-упаковка, напитки, HoReCa" },
        ],
        extraApplications: [
          "MAP-упаковка мяса, рыбы, салатов",
          "Газирование напитков",
          "Нитро-кофе и коктейли",
        ],
        safetyNotes: [
          "Используйте только пищевую сертификацию для продуктов.",
          "Хранить баллоны по ГОСТ, обеспечивать вентиляцию.",
        ],
        faq: [
          {
            q: "Можно ли заменить пищевой газ техническим?",
            a: "Нет, для продуктов допускаются только E290/E941.",
          },
        ],
      };

    // ========================== СМЕСЬ Ar/CO₂ ==========================
    case "mix-arco2":
      return {
        heroImage: "/img/gases/argon.JPG", // временно
        heroImageAlt: "Смесь Ar/CO₂",
        heroNote:
          "Смесь аргона и CO₂ для MIG/MAG-сварки сталей: стабильная дуга, меньше брызг, аккуратный шов.",
        parameters: [
          { name: "Состав", value: "Ar/CO₂ (82/18, 80/20, 92/8)" },
          {
            name: "Назначение",
            value: "MIG/MAG сварка низкоуглеродистых сталей",
          },
        ],
        extraApplications: [
          "Сварка конструкционных сталей",
          "Производственные линии и мастерские",
        ],
        safetyNotes: [
          "Работа только с исправной арматурой и вентиляцией.",
        ],
        faq: [
          {
            q: "Какая смесь популярнее?",
            a: "Чаще берут 82/18 как универсальную для большинства сталей.",
          },
        ],
      };

    // ========================== СВАРОЧНАЯ СМЕСЬ ==========================
    case "weld-mix":
      return {
        heroImage: "/img/gases/argon.JPG", // временно
        heroImageAlt: "Сварочные смеси",
        heroNote:
          "Готовые сварочные смеси для MIG/MAG и TIG: ровный шов, низкие брызги и стабильная дуга.",
        parameters: [
          { name: "Типы", value: "Ar/CO₂, Ar/O₂, специальные составы" },
          {
            name: "Применение",
            value: "Сварка сталей, нержавейки, алюминия",
          },
        ],
        extraApplications: [
          "MIG/MAG сварка в производстве",
          "TIG сварка ответственных деталей",
        ],
        safetyNotes: [
          "Подбор смеси зависит от металла и режима — поможем рассчитать.",
        ],
        faq: [
          {
            q: "Можно ли сваривать одной смесью всё?",
            a: "Иногда да, но лучше подобрать под материал — шов и расход будут лучше.",
          },
        ],
      };

    // ========================== ПГС ==========================
    case "pgs":
      return {
        heroImage: "/img/gases/nitrogen.JPG", // временно
        heroImageAlt: "Поверочные газовые смеси",
        heroNote:
          "Поверочные газовые смеси для калибровки газоанализаторов, датчиков и хроматографов.",
        parameters: [
          {
            name: "Типы смесей",
            value: "CO, CO₂, CH₄, O₂ в фоне N₂/воздуха",
          },
          {
            name: "Назначение",
            value: "Калибровка и поверка приборов",
          },
        ],
        extraApplications: [
          "Лаборатории и метрология",
          "Промышленные системы контроля воздуха",
        ],
        safetyNotes: [
          "Смеси поставляются с паспортами и сертификатами.",
        ],
        faq: [
          {
            q: "Можно ли сделать смесь под заказ?",
            a: "Да, подготовим ПГС с нужной концентрацией под ваш прибор.",
          },
        ],
      };

    default:
      return null;
  }
}

function getSolutionExtra(solution) {
  if (!solution) return null;

  switch (solution.id) {
    // ========================== БАРЫ И РЕСТОРАНЫ ==========================
    case "bar":
      return {
        heroImage: "/img/solutions/bar.JPG",
        heroImageAlt: "Бар и розлив напитков с газом",
        heroNote:
          "Комплексное решение для баров и ресторанов: CO₂ для напитков, азот для нитро-кофе, редукторы, фитинги и сервис под ключ.",
        benefits: [
          "Стабильная подача CO₂ для пива и газированных напитков",
          "Азот для нитро-кофе и коктейлей",
          "Подбор редукторов, шлангов и фитингов под ваши стойки",
          "Настройка по давлению и охлаждению под ваш формат заведения",
        ],
        recommendedGases: [
          "CO₂ (E290)",
          "Азот (E941)",
          "Пищевые смеси CO₂/N₂",
          "Азот для нитро-кофе",
        ],
        recommendedEquipment: [
          "Редукторы для CO₂ и N₂",
          "Быстроразъёмные соединения",
          "Газовые магистрали и шланги",
          "Коллекторы и распределительные гребёнки",
        ],
        flowSteps: [
          "Анализ формата заведения: что наливаете, какой объём, сколько точек розлива.",
          "Подбор схемы: тип баллонов, редукторов, разводка до барной стойки.",
          "Запуск и настройка: давление, расход, контроль пены и скорости розлива.",
          "Регламент пополнения баллонов и обслуживания системы.",
        ],
        faq: [
          {
            q: "Можно ли подключить один баллон к нескольким кранам?",
            a: "Да, через коллектор и распределение по линиям. Подберём схему под ваш бар.",
          },
        ],
      };

    // ========================== ПИЩЕВОЕ ПРОИЗВОДСТВО ==========================
    case "food":
      return {
        heroImage: "/img/solutions/food.JPG",
        heroImageAlt: "Пищевое производство с MAP-упаковкой",
        heroNote:
          "Решения для пищевых производств: MAP-упаковка, охлаждение CO₂, криогенная заморозка и инертная атмосфера.",
        benefits: [
          "Стабильные поставки пищевых газов E290/E941",
          "Подбор смеси под конкретный продукт (мясо, рыба, салаты)",
          "Решения для охлаждения и заморозки с CO₂",
          "Сопровождение по документам и безопасности",
        ],
        recommendedGases: ["CO₂ (E290)", "N₂ (E941)", "Пищевые смеси CO₂/N₂"],
        recommendedEquipment: [
          "MAP-упаковочные линии",
          "Редукторы и рампы для пищевых газов",
          "Газовые магистрали из нержавеющей стали",
          "Системы контроля утечек и датчики",
        ],
        flowSteps: [
          "Анализ продукта и требуемого срока годности.",
          "Подбор газовой смеси и расхода под вашу линию.",
          "Подбор и интеграция газового узла: баллоны, рампы, магистрали.",
          "Настройка режимов, обучение персонала и регламент обслуживания.",
        ],
        faq: [
          {
            q: "Можно ли использовать технический газ вместо пищевого?",
            a: "Нет. Для продуктов используются только газы с маркировкой E290/E941.",
          },
        ],
      };

    // ========================== МАСТЕРСКИЕ / ПРОИЗВОДСТВО ==========================
    case "workshop":
      return {
        heroImage: "/img/solutions/workshop.JPG",
        heroImageAlt: "Производственная мастерская со сваркой",
        heroNote:
          "Решения для мастерских и производств: аргон, сварочные смеси, кислород и инфраструктура газового хозяйства.",
        benefits: [
          "Комплексная поставка газов для сварки и резки",
          "Подбор баллонов и расхода под сменную загрузку",
          "Подбор сварочных смесей под материалы и режимы",
          "Возможность расширения газового узла по мере роста производства",
        ],
        recommendedGases: [
          "Аргон (Ar)",
          "Сварочные смеси Ar/CO₂",
          "Смеси Ar/O₂",
          "Кислород (O₂)",
          "CO₂",
        ],
        recommendedEquipment: [
          "Сварочные посты",
          "Рампы и гребёнки для газов",
          "Редукторы, шланги, быстроразъёмы",
          "Системы хранения баллонов",
        ],
        flowSteps: [
          "Определяем виды работ: TIG/MIG/MAG, резка, наплавка и т.д.",
          "Подбираем газы и смеси под материалы и толщины.",
          "Проектируем схему газоснабжения: от баллонов до рабочих постов.",
          "Настраиваем расход, обучаем персонал, при необходимости — сервис и ТО.",
        ],
        faq: [
          {
            q: "Какие газы нужны для TIG/MIG в одной мастерской?",
            a: "Чаще всего — аргон для TIG, Ar/CO₂ для MIG/MAG и кислород с пропаном/ацетиленом для резки.",
          },
        ],
      };

    default:
      return null;
  }
}

function getServiceExtra(service) {
  if (!service) return null;

  switch (service.id) {
    case "svc-maint":
      return {
        heroImage: "/img/services/TO.JPG",
        heroImageAlt: "Обслуживание газового оборудования",
        heroNote:
          "Регулярное обслуживание газового оборудования снижает риски простоев, утечек и аварий. Мы берем на себя регламент, осмотр и настройку.",

        benefits: [
          "Плановое ТО по согласованному графику",
          "Проверка герметичности соединений и арматуры",
          "Настройка давления, расхода и режимов работы",
          "Рекомендации по замене узлов и модернизации",
        ],

        flowSteps: [
          "Вы описываете оборудование и режим работы.",
          "Мы формируем регламент ТО и перечень проверок.",
          "Проводим обслуживание на объекте или принимаем узлы в сервис.",
          "Передаём отчёт, рекомендации и, при необходимости, дефектовку.",
        ],

        relatedEquipment: [
          "Редукторы и арматура",
          "Рампы и гребёнки",
          "Газовые шкафы и магистрали",
          "Газоанализаторы и сигнализация",
        ],

        faq: [
          {
            q: "Как часто нужно делать обслуживание?",
            a: "Зависит от нагрузки и типа оборудования. Для активных производств обычно 1–2 раза в год.",
          },
          {
            q: "Вы обслуживаете только своё оборудование?",
            a: "Нет, можем работать и с существующей инфраструктурой при наличии доступа и документации.",
          },
          {
            q: "Нужно ли останавливать производство?",
            a: "Часть работ делается на работающем оборудовании, часть — при остановке. Согласуем регламент заранее.",
          },
        ],
      };

    case "svc-audit":
      return {
        heroImage: "/img/services/audit.JPG",
        heroImageAlt: "Аудит газового хозяйства",
        heroNote:
          "Аудит газового хозяйства позволяет выявить утечки, несоответствия нормам и точки риска до того, как они станут проблемой.",

        benefits: [
          "Проверка узлов, арматуры и магистралей",
          "Поиск утечек и слабых мест",
          "Анализ документов, паспортов, регистров",
          "Рекомендации по повышению безопасности и эффективности",
        ],

        flowSteps: [
          "Собираем исходные данные: схемы, паспорта, перечень оборудования.",
          "Проводим выезд и осмотр газового хозяйства.",
          "Фиксируем замечания, фотографии, критичные точки.",
          "Готовим отчёт и план мероприятий по улучшению.",
        ],

        relatedEquipment: [
          "Газоанализаторы и датчики утечки",
          "Запорная арматура",
          "Системы сигнализации и отключения",
        ],

        faq: [
          {
            q: "Когда нужен аудит?",
            a: "При запуске нового объекта, перед проверками, после инцидентов, а также при расширении газового хозяйства.",
          },
          {
            q: "Вы выдаёте официальный отчёт?",
            a: "Да, по результатам аудита готовим структурированный отчёт с перечнем замечаний и рекомендаций.",
          },
        ],
      };

    case "svc-design":
      return {
        heroImage: "/img/services/projection.JPG",
        heroImageAlt: "Проектирование газоснабжения",
        heroNote:
          "Проектирование газоснабжения — основа безопасной и стабильной работы. Подбираем схемы, газы, магистрали и оборудование под вашу задачу.",

        benefits: [
          "Подбор газа и смесей под процессы",
          "Расчёт расхода и подбор сечений магистралей",
          "Схема размещения баллонов, рамп и шкафов",
          "Закладка резерва под расширение производства",
        ],

        flowSteps: [
          "Собираем данные: процессы, оборудование, режимы работы.",
          "Определяем потребности по газам и расходам.",
          "Проектируем схему газоснабжения и точки подключения.",
          "Согласуем проект и, при необходимости, сопровождаем монтаж.",
        ],

        relatedEquipment: [
          "Баллонные посты и рампы",
          "Магистрали (сталь/нерж.)",
          "Газовые шкафы",
          "Арматура и КИПиА",
        ],

        faq: [
          {
            q: "Вы проектируете только под свои газы?",
            a: "Мы ориентируемся на практические решения. Можем адаптировать проект под существующую инфраструктуру.",
          },
          {
            q: "Можно ли начать с небольшого решения и потом расширить?",
            a: "Да, в проекте закладываем возможности масштабирования по мере роста производства.",
          },
        ],
      };

    case "svc-install":
      return {
        heroImage: "/img/services/montaz.JPG",
        heroImageAlt: "Монтаж газового оборудования",
        heroNote:
          "Монтаж и пусконаладка газового оборудования под ключ: баллоны, рампы, магистрали, шкафы, сигнализация.",

        benefits: [
          "Монтаж баллонных постов и рамп",
          "Прокладка магистралей и подключение оборудования",
          "Пусконаладка и проверка герметичности",
          "Инструктаж персонала по эксплуатации",
        ],

        flowSteps: [
          "Согласуем проект или схему работ.",
          "Подготавливаем материалы и оборудование.",
          "Выполняем монтаж и подключение.",
          "Проводим испытания, настройку и выдаём рекомендации.",
        ],

        relatedEquipment: [
          "Рампы, гребёнки, шкафы",
          "Магистрали и шланги",
          "Газоанализаторы и сигнализация",
        ],

        faq: [
          {
            q: "Вы работаете по своему проекту или по готовому?",
            a: "Можем работать как по вашему проекту, так и по нашему решению «под ключ».",
          },
          {
            q: "Нужна ли остановка производства?",
            a: "Зависит от конфигурации. Часть работ можно выполнить с минимальными паузами, это обсуждаем на этапе планирования.",
          },
        ],
      };

    default:
      return null;
  }
}

function getEquipmentExtra(equipment) {
  if (!equipment) return null;

  switch (equipment.id) {
    case "eq-gauges":
      return {
        heroImage: "/img/equipment/manometers.jpg",
        heroImageAlt: "Манометры и контроль давления",
        heroNote:
          "Манометры для газовых систем: контроль рабочего давления, диагностика узлов и безопасная эксплуатация.",
        parameters: [
          { name: "Среда", value: "Газы: кислород, аргон, азот, CO₂ и смеси" },
          { name: "Тип корпуса", value: "Сталь, нержавеющая сталь, латунь" },
          {
            name: "Класс точности",
            value: "от 1.0 до 2.5 в зависимости от задачи",
          },
          { name: "Диаметр", value: "40–160 мм (щитовые, панельные, радиальные)" },
          { name: "Присоединение", value: "Резьба G 1/4, G 1/2 и др." },
        ],
        applications: [
          "Контроль давления на редукторах и рампах",
          "Мониторинг давления в магистралях газоснабжения",
          "Диагностика падения давления и засоров",
          "Использование на технологических постах и шкафах",
        ],
        faq: [
          {
            q: "Какой класс точности нужен?",
            a: "Для технологических задач часто достаточно 1.6–2.5, для точных измерений и контроля — 1.0. Подскажем по вашей задаче.",
          },
          {
            q: "Нужен ли манометр именно по газам?",
            a: "Да, корпус, уплотнения и заполнение подбираются под среду. Для газов используются свои исполнения.",
          },
          {
            q: "Делаете ли вы подбор по давлению?",
            a: "Да, достаточно указать тип газа, рабочее и максимальное давление — подберём манометры и арматуру.",
          },
        ],
      };

    case "eq-ramps":
      return {
        heroImage: "/img/equipment/ramps.JPG",
        heroImageAlt: "Газоразрядные рампы",
        heroNote:
          "Газоразрядные рампы для подключения нескольких баллонов: стабилизация подачи, автоматическое или ручное переключение и безопасная эксплуатация.",
        parameters: [
          { name: "Тип", value: "Односторонние и двусторонние рампы" },
          { name: "Режим", value: "Ручное или полуавтоматическое переключение" },
          {
            name: "Применение",
            value: "Технические и пищевые газы, смеси",
          },
          {
            name: "Возможность расширения",
            value: "Добавление баллонных мест по мере роста потребления",
          },
        ],
        applications: [
          "Обеспечение стабильной подачи газа на производство",
          "Организация баллонных постов с несколькими баллонами",
          "Переход на резервную линию без остановки процесса",
          "Газоснабжение упаковочных линий, сварочных постов, лабораторий",
        ],
        faq: [
          {
            q: "Когда нужна двусторонняя рампа?",
            a: "Когда важно переключаться между рабочим и резервным пакетом баллонов без остановки процесса.",
          },
          {
            q: "Можно ли потом расширить рампу?",
            a: "Чаще всего да — можно добавить дополнительные места под баллоны. Заложим это на этапе подбора.",
          },
        ],
      };

    case "eq-cylinders":
      return {
        heroImage: "/img/equipment/ballons.JPG",
        heroImageAlt: "Газовые баллоны разных объёмов",
        heroNote:
          "Баллоны 5/10/25/40/50 л для технических и пищевых газов. Поможем подобрать объём и формат под ваш расход и условия.",
        parameters: [
          { name: "Объёмы", value: "5, 10, 25, 40, 50 л" },
          {
            name: "Типы газов",
            value: "Кислород, аргон, азот, CO₂, смеси",
          },
          {
            name: "Аттестация",
            value: "Баллоны с действующей поверкой",
          },
          {
            name: "Резьба",
            value: "Стандартные резьбы под газовую арматуру",
          },
        ],
        applications: [
          "Небольшие баллоны — для сервисных работ и мобильных бригад",
          "40–50 л — для постоянных сварочных и производственных постов",
          "Пищевые баллоны — для баров, ресторанов и упаковки продуктов",
        ],
        faq: [
          {
            q: "Можно ли заправлять свои баллоны?",
            a: "Да, при наличии действующей аттестации и нормального состояния баллона. Уточняем по фото и паспортам.",
          },
          {
            q: "Какой объём баллона лучше взять?",
            a: "Зависит от расхода и частоты работы. Можем посчитать по режимам и предложить оптимальный вариант.",
          },
        ],
      };

    case "eq-storage":
      return {
        heroImage: "/img/equipment/crio.JPG",
        heroImageAlt: "Система хранения и подачи газов",
        heroNote:
          "Системы хранения и подачи: моноблоки, криоцилиндры, стационарные ёмкости. Для объектов с регулярным и крупным потреблением газа.",
        variantsInfo: {
          Моноблоки:
            "Группы баллонов, объединённых в единый блок. Удобны для стабильной подачи газа.",
          Криоцилиндры:
            "Для хранения жидких газов: CO₂, азот, аргон. Имеют высокую автономность.",
          "Стационарные ёмкости":
            "Промышленные резервуары на территориях заводов и производств.",
        },
        parameters: [
          {
            name: "Форматы",
            value: "Моноблоки, криоцилиндры, стационарные танки",
          },
          {
            name: "Газы",
            value: "Кислород, азот, аргон, CO₂ и смеси",
          },
          {
            name: "Назначение",
            value: "Производства, пищевые цеха, лаборатории",
          },
        ],
        applications: [
          "Переход с баллонов на более удобный формат хранения",
          "Снижение количества переключений и простоев",
          "Обеспечение стабильного давления и подачи газа",
          "Решения для объектов с круглосуточной загрузкой",
        ],
        faq: [
          {
            q: "Когда стоит переходить на криоцилиндры или ёмкости?",
            a: "Когда расход газа стабилен и велик, а баллонная схема становится неудобной и затратной по логистике.",
          },
          {
            q: "Вы помогаете с подбором и проектом?",
            a: "Да, можем проработать схему, подобрать оборудование и предложить комплексное решение.",
          },
        ],
      };

    default:
      return null;
  }
}
// ===================== APP =====================
function AppInner() {
  const [notice, setNotice] = useState({
    open: false,
    title: "",
    description: "",
  });

  // --- ROUTING STATE ---
  const [route, setRoute] = useState("home");
  const [selectedGas, setSelectedGas] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // --- UI STATE ---
  const [openMenuState, setOpenMenuState] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // =============== SYNC FROM HASH (правильный) ===============
  function syncFromHash() {
    if (typeof window === "undefined") return;

    let hash = window.location.hash || "#home";

    // убираем # и разбираем путь вида "route/id"
    const [path, id] = hash.replace(/^#/, "").split("/");

    switch (path) {
      case "home":
      case "catalog":
      case "gases":
      case "solutions":
      case "equipment":
      case "services":
      case "contacts":
      
        setRoute(path);
        setSelectedGas(null);
        setSelectedSolution(null);
        setSelectedService(null);
        setSelectedEquipment(null);
        break;

          case "order":
    setRoute("order");
    break;

      case "gas-details": {
        const gas = GASES.find((g) => g.id === id) || null;
        setSelectedGas(gas);
        setSelectedSolution(null);
        setSelectedService(null);
        setSelectedEquipment(null);
        setRoute("gas-details");
        break;
      }

      case "solution-details": {
        const sol = SOLUTIONS.find((s) => s.id === id) || null;
        setSelectedSolution(sol);
        setSelectedGas(null);
        setSelectedService(null);
        setSelectedEquipment(null);
        setRoute("solution-details");
        break;
      }

      case "equipment-details": {
        const eq = EQUIPMENT.find((e) => e.id === id) || null;
        setSelectedEquipment(eq);
        setSelectedGas(null);
        setSelectedSolution(null);
        setSelectedService(null);
        setRoute("equipment-details");
        break;
      }

      case "service-details": {
        const svc = SERVICES.find((s) => s.id === id) || null;
        // 🔧 ФИКС: пишем в selectedService, а не в selectedSolution
        setSelectedService(svc);
        setSelectedGas(null);
        setSelectedSolution(null);
        setSelectedEquipment(null);
        setRoute("service-details");
        break;
      }

      default:
        setRoute("home");
        setSelectedGas(null);
        setSelectedSolution(null);
        setSelectedService(null);
        setSelectedEquipment(null);
        break;
    }
  }

  // =============== HASHCHANGE LISTENER ===============
  useEffect(() => {
    if (typeof window === "undefined") return;

    syncFromHash(); // Первый рендер — читаем hash из URL

    const handler = () => syncFromHash();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // =============== SYNC TO HASH (route → hash) ===============
  const selectedEquipmentId = selectedEquipment?.id;
  const selectedSolutionId = selectedSolution?.id;
  const selectedServiceId = selectedService?.id;
  const selectedGasId = selectedGas?.id;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let hashRoute = route;

    if (route === "equipment-details" && selectedEquipmentId) {
      hashRoute = `equipment-details/${selectedEquipmentId}`;
    }
    if (route === "solution-details" && selectedSolutionId) {
      hashRoute = `solution-details/${selectedSolutionId}`;
    }
    if (route === "gas-details" && selectedGasId) {
      hashRoute = `gas-details/${selectedGasId}`;
    }
    if (route === "service-details" && selectedServiceId) {
      hashRoute = `service-details/${selectedServiceId}`;
    }

    const newHash = `#${hashRoute}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  }, [route, selectedEquipmentId, selectedSolutionId, selectedServiceId, selectedGasId]);

  function openGasPage(g) {
    setSelectedGas(g);
    setSelectedEquipment(null);
    setSelectedSolution(null);
    setSelectedService(null);
    setSelectedVariant(null);
    setRoute("gas-details");
    setOpenMenuState(null);
    setMobileNavOpen(false);
  }

  function openSolutionPage(s, variantLabel) {
    setSelectedSolution(s);
    setSelectedGas(null);
    setSelectedEquipment(null);
    setSelectedService(null);
    setSelectedVariant(variantLabel || null);
    setRoute("solution-details");
    setOpenMenuState(null);
    setMobileNavOpen(false);
  }

  function openServicePage(s) {
    setSelectedService(s);
    setSelectedGas(null);
    setSelectedSolution(null);
    setSelectedEquipment(null);
    setSelectedVariant(null);
    setRoute("service-details");
    setOpenMenuState(null);
    setMobileNavOpen(false);
  }

  function openEquipmentPage(e) {
    setSelectedEquipment(e);
    setSelectedGas(null);
    setSelectedSolution(null);
    setSelectedService(null);
    setSelectedVariant(null);
    setRoute("equipment-details");
    setOpenMenuState(null);
    setMobileNavOpen(false);
  }

  const [cylinder, setCylinder] = useState(null);
  const [ownership, setOwnership] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState(CONFIG.DEFAULT_REGION);
  const [comment, setComment] = useState("");
  const officeMapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(
    CONFIG.OFFICE_ADDR
  )}`;
  const prodMapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(
    CONFIG.PROD_ADDR
  )}`;

  const productTitleBase =
    selectedGas?.name ||
    selectedSolution?.name ||
    selectedService?.name ||
    selectedEquipment?.name ||
    "";
  const productTitle = selectedVariant
    ? `${productTitleBase} — ${selectedVariant}`
    : productTitleBase;

  const productDesc =
    selectedGas?.description ||
    (selectedSolution
      ? Array.isArray(selectedSolution.items)
        ? selectedSolution.items.join(" • ")
        : selectedSolution.items
      : selectedService
      ? Array.isArray(selectedService.items)
        ? selectedService.items.join(" • ")
        : selectedService.items
      : selectedEquipment
      ? selectedEquipment.items
      : "");
  const productUses = selectedGas?.uses || [];

    // Быстрый заказ для услуг / оборудования / готовых решений:
  // для них пропускаем шаг с выбором баллонов
  const isService =
    !!(selectedService && SERVICES.some((s) => s.id === selectedService.id));
  const isEquipment =
    !!(selectedEquipment && EQUIPMENT.some((e) => e.id === selectedEquipment.id));
  const isSolution =
    !!(selectedSolution && SOLUTIONS.some((s) => s.id === selectedSolution.id));

  // для услуг, оборудования и готовых решений — пропускаем газовые шаги
  const skipOrderSteps = isService || isEquipment || isSolution;

  function resetOrder() {
    setCylinder(null);
    setOwnership(null);
    setDelivery(null);
    setPhone("");
    setComment("");
  }

  function startOrderFromGas(g, variantLabel) {
    setSelectedGas(g);
    setSelectedSolution(null);
    setSelectedService(null);
    setSelectedEquipment(null);
    setSelectedVariant(variantLabel || null);
    setRoute("order");
    resetOrder();
    setOpenMenuState(null);
    setMobileNavOpen(false);
  }

  function startOrderFromSolution(item, variantLabel) {
    const isSolutionItem = SOLUTIONS.some((s) => s.id === item.id);
    const isServiceItem = SERVICES.some((s) => s.id === item.id);
    const isEquipmentItem = EQUIPMENT.some((e) => e.id === item.id);

    // Сначала всё сбрасываем
    setSelectedGas(null);
    setSelectedSolution(null);
    setSelectedService(null);
    setSelectedEquipment(null);

    if (isSolutionItem) {
      setSelectedSolution(item);
    } else if (isServiceItem) {
      setSelectedService(item);
    } else if (isEquipmentItem) {
      setSelectedEquipment(item);
    } else {
      // запасной вариант — считаем решением
      setSelectedSolution(item);
    }

    setSelectedVariant(variantLabel || null);
    setRoute("order");
    resetOrder();
    setOpenMenuState(null);
    setMobileNavOpen(false);
  }

  // Отправка в Telegram
  async function sendTelegram(payload) {
    try {
      const text = [
        "📦 *Новая заявка*",
        `Товар/услуга: ${payload.product}`,
        `Описание: ${payload.desc || "-"}`,
        `Тара: ${payload.cylinder || "-"} л`,
        `Владение: ${payload.ownership || "-"}`,
        `Доставка: ${payload.delivery || "-"}`,
        `Телефон: ${payload.phone}`,
        `Регион: ${payload.region || "-"}`,
        `Комментарий: ${payload.comment || "-"}`,
        `Время: ${payload.timestamp || new Date().toISOString()}`,
      ].join("\n");

     const res = await fetch("/.netlify/functions/send-telegram", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ text }),
});

      const j = await res.json();
      console.log("Telegram response:", j);
      return j.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async function submitOrder() {
    const payload = {
      product: productTitle,
      desc: productDesc,
      cylinder,
      ownership,
      delivery,
      phone,
      region,
      comment,
      timestamp: new Date().toISOString(),
    };

    const ok = await sendTelegram(payload);
    setNotice({
      open: true,
      title: ok ? "ЗАЯВКА ОТПРАВЛЕНА" : "ОШИБКА",
      description: ok
        ? "Менеджер свяжется с вами"
        : "Не удалось отправить. Проверьте интернет или токен.",
    });

    if (ok) setRoute("home");

    setTimeout(
      () => setNotice({ open: false, title: "", description: "" }),
      4500
    );
  }

  const canSubmit = skipOrderSteps
    ? phone && phone.length >= 6
    : cylinder && ownership && delivery && phone && phone.length >= 6;

  const navBtnClass = (isActive) =>
    classNames(
      "hover:text-sky-700",
      isActive ? "text-sky-700 font-medium" : "text-slate-800"
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] text-slate-900">
      {/* Header */}
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
              {mobileNavOpen ? (
  <X className="w-5 h-5" />
) : (
  <Menu className="w-5 h-5" />
)}
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

            <Dropdown
              label="Газы и смеси"
              items={GASES}
              onSelect={(item, variantLabel) => {
                if (variantLabel) {
                  // клик по "99.7%", "99.95%" и т.п. -> сразу к выбору тары
                  startOrderFromGas(item, variantLabel);
                } else {
                  // клик по строке газа -> страница газа
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
        {/* Главная */}
        <Button
          variant="ghost"
          onClick={() => {
            setRoute("home");
            setMobileNavOpen(false);
            setOpenMenuState(null);
          }}
        >
          Главная
        </Button>

        {/* Газы и смеси (мобайл) */}
        <div className="border border-sky-100 rounded-lg">
          <button
            type="button"
            className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-slate-800"
            onClick={() =>
              setOpenMenuState((prev) =>
                prev === "gases-mobile" ? null : "gases-mobile"
              )
            }
          >
            <span>Газы и смеси</span>
            <ChevronDown
              className={classNames(
                "w-4 h-4 transition-transform",
                openMenuState === "gases-mobile" ? "rotate-180" : ""
              )}
            />
          </button>

          {openMenuState === "gases-mobile" && (
            <div className="pt-1 pb-2 border-t border-sky-50 max-h-72 overflow-y-auto">
              {GASES.map((g) => (
                <div
                  key={g.id}
                  className="px-2 py-1 text-sm border-b last:border-b-0 border-sky-50"
                >
                  {/* Клик по названию газа -> страница газа */}
                  <button
                    type="button"
                    className="w-full text-left text-slate-800 font-medium"
                    onClick={() => {
                      openGasPage(g);
                      setMobileNavOpen(false);
                      setOpenMenuState(null);
                    }}
                  >
                    {g.name}
                  </button>

                  {/* Клик по варианту -> сразу заказ */}
                  {Array.isArray(g.variants) && g.variants.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {g.variants.map((v) => (
                        <button
                          key={v.id || v.label}
                          type="button"
                          className="px-2 py-1 text-xs rounded-md border border-sky-200 text-sky-700 hover:bg-sky-50"
                          onClick={() => {
                            startOrderFromGas(g, v.label);
                            setMobileNavOpen(false);
                            setOpenMenuState(null);
                          }}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Остальное меню можно оставить как было */}
        <Button
          variant="ghost"
          onClick={() => {
            setRoute("solutions");
            setMobileNavOpen(false);
            setOpenMenuState(null);
          }}
        >
          Готовые решения
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            setRoute("services");
            setMobileNavOpen(false);
            setOpenMenuState(null);
          }}
        >
          Услуги
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            setRoute("equipment");
            setMobileNavOpen(false);
            setOpenMenuState(null);
          }}
        >
          Оборудование
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            setRoute("contacts");
            setMobileNavOpen(false);
            setOpenMenuState(null);
          }}
        >
          Контакты
        </Button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4">
        <AnimatePresence mode="wait">
          {route === "home" && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-start">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold leading-tight break-words uppercase">
                    Промышленные газы и сопутствующие услуги
                  </h1>
                  <div className="mt-4">
                    <img
                      src="/logo.png"
                      alt="Логотип Машпромстрой"
                      className="w-28 sm:w-32 md:w-40 drop-shadow"
                    />
                  </div>
                  <p className="mt-4 text-slate-600 text-base sm:text-lg break-words">
                    {CONFIG.BRAND} — поставки газов, инженерные решения и
                    сервис для производства, HoReCa и лабораторий.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      className="bg-sky-600 hover:bg-sky-700"
                      onClick={() => setRoute("catalog")}
                    >
                      Каталог {CONFIG.PRICE_FROM}
                    </Button>
                    <Button
                      className="bg-sky-700 hover:bg-sky-800 text-white"
                      onClick={() => setRoute("contacts")}
                    >
                      <Phone className="w-4 h-4 mr-2" /> Связаться
                    </Button>
                  </div>
                  <InfoStrip />
                </div>
                <div className="min-w-0">
                  <Card className="bg-white/70 backdrop-blur border-sky-100 overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg uppercase">
                        Как оформляется заказ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-2 w-full bg-gradient-to-r from-sky-600 via-sky-400 to-cyan-300 rounded-full opacity-80"></div>
                      <ol className="mt-4 space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 grid place-items-center flex-shrink-0">
                            1
                          </span>
                          <span className="min-w-0 break-words">
                            Выберите газ, решение, услугу или оборудование
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 grid place-items-center flex-shrink-0">
                            2
                          </span>
                          <span className="min-w-0 break-words">
                            Для газов укажите объём/тару и доставку
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 grid place-items-center flex-shrink-0">
                            3
                          </span>
                          <span className="min-w-0 break-words">
                            Оставьте телефон — менеджер свяжется
                          </span>
                        </li>
                      </ol>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          className="bg-sky-600 hover:bg-sky-700"
                          onClick={() => setRoute("gases")}
                        >
                          Каталог {CONFIG.PRICE_FROM}
                        </Button>

                        <Button
                          variant="outline"
                          className="border-sky-300 text-sky-700 hover:bg-sky-50"
                          onClick={() => setRoute("equipment")}
                        >
                          Оборудование
                        </Button>

                        <Button
                          className="bg-sky-700 hover:bg-sky-800 text-white"
                          onClick={() => setRoute("contacts")}
                        >
                          <Phone className="w-4 h-4 mr-2" /> Связаться
                        </Button>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          className="bg-sky-600 hover:bg-sky-700"
                          onClick={() => setRoute("gases")}
                        >
                          Сделать заказ{" "}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <SectionTitle
                title="Почему выбирают нас"
                subtitle="Ключевые преимущества Машпромстроя"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                {[
                  {
                    key: "quality",
                    icon: <FlaskConical className="w-5 h-5" />,
                    title: "Чистота и контроль",
                    text: "Гарантируем стабильную чистоту газов и отслеживаем партии. Документы и паспорта качества — по запросу.",
                  },
                  {
                    key: "logistics",
                    icon: <Truck className="w-5 h-5" />,
                    title: "Сроки и логистика",
                    text: "Доставим в удобное время или подготовим к самовывозу. Работаем по графикам производства.",
                  },
                  {
                    key: "solutions",
                    icon: <Droplets className="w-5 h-5" />,
                    title: "Комплексные решения",
                    text: "Подберём оборудование, редукторы и арматуру. Поможем запустить и обучим персонал.",
                  },
                  {
                    key: "eco",
                    icon: <Leaf className="w-5 h-5" />,
                    title: "Экология",
                    text: "Чистые процессы, снижение CO₂ и бережное отношение к окружающей среде.",
                  },
                  {
                    key: "service",
                    icon: <Wrench className="w-5 h-5" />,
                    title: "Сервис",
                    text: "Поддержка на всех этапах: подбор, пусконаладка, регулярное обслуживание.",
                  },
                ].map((c) => (
                  <Card
                    key={c.key}
                    className="bg-white/70 border-sky-100 overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 uppercase">
                        {c.icon}
                        <span className="break-words">{c.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600 break-words">
                      {c.text}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>
          )}

          {route === "gas-details" && selectedGas && (
            <motion.section
              key="gas-details"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              {(() => {
                const extra = getGasExtra(selectedGas);

                return (
                  <>
                    <SectionTitle
                      title={selectedGas.name}
                      subtitle={selectedGas.description}
                    />

                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      {/* Левая колонка: картинка + быстрые факты */}
                      <div className="md:col-span-1">
                        <Card className="bg-white/80 border-sky-100 overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-sm sm:text-base uppercase">
                              Общее описание
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm text-slate-600">
                            {extra?.heroImage && (
                              <div className="rounded-lg overflow-hidden mb-2">
                                <img
                                  src={extra.heroImage}
                                  alt={extra.heroImageAlt}
                                  className="w-full h-40 object-cover"
                                />
                              </div>
                            )}
                            <p>
                              {extra?.heroNote ||
                                "Газ для промышленных и технологических задач."}
                            </p>
                            {selectedGas.uses?.length > 0 && (
                              <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                                  Основные области применения
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {selectedGas.uses.map((u) => (
                                    <Tag key={u}>{u}</Tag>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Правая часть: таблица параметров */}
                      <div className="md:col-span-2">
                        <Card className="bg-white/80 border-sky-100 overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-sm sm:text-base uppercase">
                              Основные параметры
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="overflow-x-auto">
                            <table className="min-w-full text-xs sm:text-sm text-slate-700">
                              <tbody>
                                {extra?.parameters?.map((row) => (
                                  <tr
                                    key={row.name}
                                    className="border-b border-sky-50 last:border-0"
                                  >
                                    <td className="py-2 pr-4 align-top font-medium text-slate-500 whitespace-nowrap">
                                      {row.name}
                                    </td>
                                    <td className="py-2 align-top">
                                      {row.value}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Расширенное применение */}
                    {extra?.extraApplications && (
                      <Card className="bg-white/80 border-sky-100 mb-4">
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base uppercase">
                            Примеры применения
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc ml-4 text-sm text-slate-600 space-y-1">
                            {extra.extraApplications.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Безопасность */}
                    {extra?.safetyNotes && (
                      <Card className="bg-white/80 border-sky-100 mb-4">
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base uppercase">
                            Особенности безопасности
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc ml-4 text-sm text-slate-600 space-y-1">
                            {extra.safetyNotes.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* FAQ */}
                    {extra?.faq && (
                      <Card className="bg-white/80 border-sky-100 mb-4">
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base uppercase">
                            Вопросы и ответы по газу
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {extra.faq.map((item, idx) => (
                            <details
                              key={idx}
                              className="group border border-sky-100 rounded-lg px-3 py-2 bg-white/60"
                            >
                              <summary className="cursor-pointer text-sm font-medium text-slate-800 flex items-center justify-between gap-2">
                                <span>{item.q}</span>
                                <span className="text-xs text-sky-600 group-open:hidden">
                                  Показать
                                </span>
                                <span className="text-xs text-sky-600 hidden group-open:inline">
                                  Скрыть
                                </span>
                              </summary>
                              <div className="mt-2 text-sm text-slate-600">
                                {item.a}
                              </div>
                            </details>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Кнопка заказать */}
                    <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => setRoute("gases")}
                        className="text-sm"
                      >
                        ← Ко всем газам
                      </Button>
                      <Button
                        className="bg-sky-600 hover:bg-sky-700"
                        onClick={() => startOrderFromGas(selectedGas)}
                      >
                        Заказать {selectedGas.name}
                      </Button>
                    </div>
                  </>
                );
              })()}
            </motion.section>
          )}

          {route === "catalog" && (
            <motion.section
              key="catalog"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              <SectionTitle
                title="Каталог"
                subtitle={`Цена всех товаров начинается ${CONFIG.PRICE_FROM}`}
              />

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {/* Газы и смеси */}
                <Card className="bg-white/70 border-sky-100 overflow-hidden">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setRoute("gases")}
                  >
                    <CardTitle className="text-base sm:text-lg uppercase text-sky-700 hover:underline">
                      Газы и смеси
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {GASES.map((g) => (
                      <div
                        key={g.id}
                        className="p-3 rounded-xl border border-sky-100 hover:bg-sky-50/50 flex items-center justify-between gap-3 min-w-0"
                      >
                        <div className="min-w-0">
                          <div className="font-medium break-words uppercase">
                            {g.name}
                          </div>
                          <div className="text-xs text-slate-600 break-words">
                            {g.description}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {g.uses.map((u) => (
                              <Tag key={u}>{u}</Tag>
                            ))}
                          </div>
                        </div>
                        <Button
                          className="bg-sky-600 hover:bg-sky-700 flex-shrink-0"
                          onClick={() => openGasPage(g)}
                        >
                          Подробнее
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Готовые решения */}
                <Card className="bg-white/70 border-sky-100 overflow-hidden">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setRoute("solutions")}
                  >
                    <CardTitle className="text-base sm:text-lg uppercase text-sky-700 hover:underline">
                      Готовые решения
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {SOLUTIONS.map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-xl border border-sky-100 hover:bg-sky-50/50 flex items-center justify-between gap-3 min-w-0"
                      >
                        <div className="min-w-0">
                          <div className="font-medium break-words uppercase">
                            {s.name}
                          </div>
                          <div className="text-xs text-slate-600 break-words">
                            {s.items.join(" • ")}
                          </div>
                        </div>
                        <Button
                          className="bg-sky-600 hover:bg-sky-700 flex-shrink-0"
                          onClick={() => openSolutionPage(s)}
                        >
                          Подробнее
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Услуги */}
                <Card className="bg-white/70 border-sky-100 overflow-hidden">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setRoute("services")}
                  >
                    <CardTitle className="text-base sm:text-lg uppercase text-sky-700 hover:underline">
                      Услуги
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {SERVICES.map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-xl border border-sky-100 hover:bg-sky-50/50 flex items-center justify-between gap-3 min-w-0"
                      >
                        <div className="min-w-0">
                          <div className="font-medium break-words uppercase">
                            {s.name}
                          </div>
                          {s.items && (
                            <div className="text-xs text-slate-600 break-words">
                              {s.items}
                            </div>
                          )}
                        </div>
                        <Button
                          className="bg-sky-600 hover:bg-sky-700 flex-shrink-0"
                          onClick={() => openServicePage(s)}
                        >
                          Подробнее
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Оборудование */}
                <Card className="bg-white/70 border-sky-100 overflow-hidden">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setRoute("equipment")}
                  >
                    <CardTitle className="text-base sm:text-lg uppercase text-sky-700 hover:underline">
                      Оборудование
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {EQUIPMENT.map((e) => (
                      <div
                        key={e.id}
                        className="p-3 rounded-xl border border-sky-100 hover:bg-sky-50/50 flex items-center justify-between gap-3 min-w-0"
                      >
                        <div className="min-w-0">
                          <div className="font-medium break-words uppercase">
                            {e.name}
                          </div>
                          {e.items && (
                            <div className="text-xs text-slate-600 break-words">
                              {e.items}
                            </div>
                          )}
                          {Array.isArray(e.variants) &&
                            e.variants.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {e.variants.map((v) => (
                                  <Button
                                    key={v.id}
                                    variant="outline"
                                    className="h-7 px-2 py-1 text-xs border-sky-300 text-sky-700 hover:bg-sky-50"
                                    onClick={() =>
                                      startOrderFromSolution(e, v.label)
                                    }
                                  >
                                    {v.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            className="bg-sky-600 hover:bg-sky-700"
                            onClick={() => startOrderFromSolution(e)}
                          >
                            Заказать
                          </Button>
                          <Button
                            variant="outline"
                            className="h-7 px-3 text-xs border-sky-300"
                            onClick={() => openEquipmentPage(e)}
                          >
                            Подробнее
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.section>
          )}

          {route === "gases" && (
            <motion.section
              key="gases"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              <SectionTitle
                title="Газы и смеси"
                subtitle={`Цена начинается ${CONFIG.PRICE_FROM}`}
              />

              <GasConsumptionCalculator />

              <Card className="bg-white/70 border-sky-100 overflow-hidden">
                <CardContent className="space-y-3">
                  {GASES.map((g) => (
                    <div
                      key={g.id}
                      className="p-3 rounded-xl border border-sky-100 hover:bg-sky-50/50 flex items-center justify-between gap-3 min-w-0"
                    >
                      <div className="min-w-0">
                        <div className="font-medium break-words uppercase">
                          {g.name}
                        </div>
                        <div className="text-xs text-slate-600 break-words">
                          {g.description}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {g.uses.map((u) => (
                            <Tag key={u}>{u}</Tag>
                          ))}
                        </div>
                        {Array.isArray(g.variants) &&
                          g.variants.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {g.variants.map((v) => (
                                <Button
                                  key={v.id}
                                  variant="outline"
                                  className="h-7 px-2 py-1 text-xs border-sky-200"
                                  onClick={() =>
                                    startOrderFromGas(g, v.label)
                                  }
                                >
                                  {v.label}
                                </Button>
                              ))}
                            </div>
                          )}
                      </div>
                      <Button
                        className="bg-sky-600 hover:bg-sky-700 flex-shrink-0"
                        onClick={() => openGasPage(g)}
                      >
                        Подробнее
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
          )}

          {route === "solutions" && (
            <motion.section
              key="solutions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              <SectionTitle
                title="Готовые решения"
                subtitle={`Цена начинается ${CONFIG.PRICE_FROM}`}
              />
              <Card className="bg-white/70 border-sky-100 overflow-hidden">
                <CardContent className="space-y-3">
                  {SOLUTIONS.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl border border-sky-100 hover:bg-sky-50/50 flex items-center justify-between gap-3 min-w-0"
                    >
                                            <div className="min-w-0">
                        <div className="font-medium break-words uppercase">
                          {s.name}
                        </div>
                        {s.items && (
                          <div className="text-xs text-slate-600 break-words">
                            {Array.isArray(s.items)
                              ? s.items.join(" • ")
                              : s.items}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button
                          className="bg-sky-600 hover:bg-sky-700"
                          onClick={() => openSolutionPage(s)}
                        >
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
          )}

          {route === "services" && (
            <motion.section
              key="services"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              <SectionTitle
                title="Услуги"
                subtitle="Аудит, проектирование, монтаж и обслуживание газового хозяйства"
              />
              <Card className="bg-white/70 border-sky-100 overflow-hidden">
                <CardContent className="space-y-3">
                  {SERVICES.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl border border-sky-100 hover:bg-sky-50/50 flex items-center justify-between gap-3 min-w-0"
                    >
                      <div className="min-w-0">
                        <div className="font-medium break-words uppercase">
                          {s.name}
                        </div>
                        {s.items && (
                          <div className="text-xs text-slate-600 break-words">
                            {Array.isArray(s.items)
                              ? s.items.join(" • ")
                              : s.items}
                          </div>
                        )}
                      </div>
                          <div className="flex flex-col gap-2 flex-shrink-0">
      <Button
        className="bg-sky-600 hover:bg-sky-700"
        onClick={() => openServicePage(s)}
      >
        Подробнее
      </Button>
      <Button
        className="bg-sky-700 hover:bg-sky-800"
        onClick={() => startOrderFromSolution(s)}
      >
        Оставить заявку
      </Button>
    </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
          )}

          {route === "equipment" && (
            <motion.section
              key="equipment"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              <SectionTitle
                title="Оборудование"
                subtitle="Манометры, рампы, баллоны и системы хранения"
              />
              <Card className="bg-white/70 border-sky-100 overflow-hidden">
                <CardContent className="space-y-3">
                  {EQUIPMENT.map((e) => (
                    <div
                      key={e.id}
                      className="p-3 rounded-xl border border-sky-100 hover:bg-sky-50/50 flex items-center justify-between gap-3 min-w-0"
                    >
                      <div className="min-w-0">
                        <div className="font-medium break-words uppercase">
                          {e.name}
                        </div>
                        {e.items && (
                          <div className="text-xs text-slate-600 break-words">
                            {e.items}
                          </div>
                        )}
                        {Array.isArray(e.variants) && e.variants.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {e.variants.map((v) => (
                              <Button
                                key={v.id}
                                variant="outline"
                                className="h-7 px-2 py-1 text-xs border-sky-300 text-sky-700 hover:bg-sky-50"
                                onClick={() =>
                                  startOrderFromSolution(e, v.label)
                                }
                              >
                                {v.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button
                          className="bg-sky-600 hover:bg-sky-700"
                          onClick={() => startOrderFromSolution(e)}
                        >
                          Заказать
                        </Button>
                        <Button
                          variant="outline"
                          className="h-7 px-3 text-xs border-sky-300"
                          onClick={() => openEquipmentPage(e)}
                        >
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
          )}

          {route === "solution-details" && selectedSolution && (
            <motion.section
              key="solution-details"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              {(() => {
                const extra = getSolutionExtra(selectedSolution);

                return (
                  <>
                    <SectionTitle
                      title={selectedSolution.name}
                      subtitle={
                        Array.isArray(selectedSolution.items)
                          ? selectedSolution.items.join(" • ")
                          : selectedSolution.items
                      }
                    />

                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      <div className="md:col-span-1">
                        <Card className="bg-white/80 border-sky-100 overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-sm sm:text-base uppercase">
                              О решении
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm text-slate-600">
                            {extra?.heroImage && (
                              <div className="rounded-lg overflow-hidden mb-2">
                                <img
                                  src={extra.heroImage}
                                  alt={extra.heroImageAlt}
                                  className="w-full h-40 object-cover"
                                />
                              </div>
                            )}
                            <p>
                              {extra?.heroNote ||
                                "Комплексное решение под вашу задачу по газам и оборудованию."}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        {extra?.benefits && (
                          <Card className="bg-white/80 border-sky-100">
                            <CardHeader>
                              <CardTitle className="text-sm sm:text-base uppercase">
                                Что вы получаете
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc ml-4 text-sm text-slate-600 space-y-1">
                                {extra.benefits.map((b, idx) => (
                                  <li key={idx}>{b}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {extra?.flowSteps && (
                          <Card className="bg-white/80 border-sky-100">
                            <CardHeader>
                              <CardTitle className="text-sm sm:text-base uppercase">
                                Как мы работаем
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ol className="list-decimal ml-4 text-sm text-slate-600 space-y-1">
                                {extra.flowSteps.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ol>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {extra?.recommendedGases && (
                        <Card className="bg-white/80 border-sky-100">
                          <CardHeader>
                            <CardTitle className="text-sm sm:text-base uppercase">
                              Рекомендуемые газы
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-wrap gap-2">
                            {extra.recommendedGases.map((g) => (
                              <Tag key={g}>{g}</Tag>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                      {extra?.recommendedEquipment && (
                        <Card className="bg-white/80 border-sky-100">
                          <CardHeader>
                            <CardTitle className="text-sm sm:text-base uppercase">
                              Оборудование
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-wrap gap-2">
                            {extra.recommendedEquipment.map((g) => (
                              <Tag key={g}>{g}</Tag>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {extra?.faq && (
                      <Card className="bg-white/80 border-sky-100 mb-4">
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base uppercase">
                            Частые вопросы по решению
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {extra.faq.map((item, idx) => (
                            <details
                              key={idx}
                              className="group border border-sky-100 rounded-lg px-3 py-2 bg-white/60"
                            >
                              <summary className="cursor-pointer text-sm font-medium text-slate-800 flex items-center justify-between gap-2">
                                <span>{item.q}</span>
                                <span className="text-xs text-sky-600 group-open:hidden">
                                  Показать
                                </span>
                                <span className="text-xs text-sky-600 hidden group-open:inline">
                                  Скрыть
                                </span>
                              </summary>
                              <div className="mt-2 text-sm text-slate-600">
                                {item.a}
                              </div>
                            </details>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
  <Button
    variant="ghost"
    onClick={() => setRoute("solutions")}
    className="text-sm"
  >
    ← Ко всем решениям
  </Button>
  <Button
    className="bg-sky-700 hover:bg-sky-800"
    onClick={() => startOrderFromSolution(selectedSolution)}
  >
    Оставить заявку
  </Button>
</div>
                  </>
                );
              })()}
            </motion.section>
          )}

          {route === "service-details" && selectedService && (
            <motion.section
              key="service-details"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              {(() => {
                const extra = getServiceExtra(selectedService);

                return (
                  <>
                    <SectionTitle
                      title={selectedService.name}
                      subtitle={
                        Array.isArray(selectedService.items)
                          ? selectedService.items.join(" • ")
                          : selectedService.items
                      }
                    />

                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      <div className="md:col-span-1">
                        <Card className="bg-white/80 border-sky-100 overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-sm sm:text-base uppercase">
                              О услуге
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm text-slate-600">
                            {extra?.heroImage && (
                              <div className="rounded-lg overflow-hidden mb-2">
                                <img
                                  src={extra.heroImage}
                                  alt={extra.heroImageAlt}
                                  className="w-full h-40 object-cover"
                                />
                              </div>
                            )}
                            <p>
                              {extra?.heroNote ||
                                "Услуга для безопасной и эффективной работы газового хозяйства."}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        {extra?.benefits && (
                          <Card className="bg-white/80 border-sky-100">
                            <CardHeader>
                              <CardTitle className="text-sm sm:text-base uppercase">
                                Что входит
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc ml-4 text-sm text-slate-600 space-y-1">
                                {extra.benefits.map((b, idx) => (
                                  <li key={idx}>{b}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {extra?.flowSteps && (
                          <Card className="bg-white/80 border-sky-100">
                            <CardHeader>
                              <CardTitle className="text-sm sm:text-base uppercase">
                                Этапы работы
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ol className="list-decimal ml-4 text-sm text-slate-600 space-y-1">
                                {extra.flowSteps.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ol>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>

                    {extra?.relatedEquipment && (
                      <Card className="bg-white/80 border-sky-100 mb-4">
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base uppercase">
                            Связанное оборудование
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                          {extra.relatedEquipment.map((x) => (
                            <Tag key={x}>{x}</Tag>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {extra?.faq && (
                      <Card className="bg-white/80 border-sky-100 mb-4">
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base uppercase">
                            Частые вопросы
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {extra.faq.map((item, idx) => (
                            <details
                              key={idx}
                              className="group border border-sky-100 rounded-lg px-3 py-2 bg-white/60"
                            >
                              <summary className="cursor-pointer text-sm font-medium text-slate-800 flex items-center justify-between gap-2">
                                <span>{item.q}</span>
                                <span className="text-xs text-sky-600 group-open:hidden">
                                  Показать
                                </span>
                                <span className="text-xs text-sky-600 hidden group-open:inline">
                                  Скрыть
                                </span>
                              </summary>
                              <div className="mt-2 text-sm text-slate-600">
                                {item.a}
                              </div>
                            </details>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
  <Button
    variant="ghost"
    onClick={() => setRoute("services")}
    className="text-sm"
  >
    ← Ко всем услугам
  </Button>
  <Button
    className="bg-sky-700 hover:bg-sky-800"
    onClick={() => startOrderFromSolution(selectedService)}
  >
    Оставить заявку
  </Button>
</div>
                  </>
                );
              })()}
            </motion.section>
          )}

          {route === "equipment-details" && selectedEquipment && (
            <motion.section
              key="equipment-details"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              {(() => {
                const extra = getEquipmentExtra(selectedEquipment);

                return (
                  <>
                    <SectionTitle
                      title={selectedEquipment.name}
                      subtitle={selectedEquipment.items}
                    />

                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      <div className="md:col-span-1">
                        <Card className="bg-white/80 border-sky-100 overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-sm sm:text-base uppercase">
                              Оборудование
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm text-slate-600">
                            {extra?.heroImage && (
                              <div className="rounded-lg overflow-hidden mb-2">
                                <img
                                  src={extra.heroImage}
                                  alt={extra.heroImageAlt}
                                  className="w-full h-40 object-cover"
                                />
                              </div>
                            )}
                            <p>
                              {extra?.heroNote ||
                                "Оборудование для работы с промышленными газами."}
                            </p>
                            {Array.isArray(selectedEquipment.variants) &&
                              selectedEquipment.variants.length > 0 && (
                                <div>
                                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                                    Доступные исполнения
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedEquipment.variants.map((v) => (
                                      <Tag key={v.id || v.label}>
                                        {v.label}
                                      </Tag>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </CardContent>
                        </Card>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        {extra?.parameters && (
                          <Card className="bg-white/80 border-sky-100 overflow-hidden">
                            <CardHeader>
                              <CardTitle className="text-sm sm:text-base uppercase">
                                Основные параметры
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="overflow-x-auto">
                              <table className="min-w-full text-xs sm:text-sm text-slate-700">
                                <tbody>
                                  {extra.parameters.map((row) => (
                                    <tr
                                      key={row.name}
                                      className="border-b border-sky-50 last:border-0"
                                    >
                                      <td className="py-2 pr-4 align-top font-medium text-slate-500 whitespace-nowrap">
                                        {row.name}
                                      </td>
                                      <td className="py-2 align-top">
                                        {row.value}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </CardContent>
                          </Card>
                        )}

                        {extra?.applications && (
                          <Card className="bg-white/80 border-sky-100">
                            <CardHeader>
                              <CardTitle className="text-sm sm:text-base uppercase">
                                Применение
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc ml-4 text-sm text-slate-600 space-y-1">
                                {extra.applications.map((a, idx) => (
                                  <li key={idx}>{a}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>

                    {extra?.faq && (
                      <Card className="bg-white/80 border-sky-100 mb-4">
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base uppercase">
                            Частые вопросы
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {extra.faq.map((item, idx) => (
                            <details
                              key={idx}
                              className="group border border-sky-100 rounded-lg px-3 py-2 bg-white/60"
                            >
                              <summary className="cursor-pointer text-sm font-medium text-slate-800 flex items-center justify-between gap-2">
                                <span>{item.q}</span>
                                <span className="text-xs text-sky-600 group-open:hidden">
                                  Показать
                                </span>
                                <span className="text-xs text-sky-600 hidden group-open:inline">
                                  Скрыть
                                </span>
                              </summary>
                              <div className="mt-2 text-sm text-slate-600">
                                {item.a}
                              </div>
                            </details>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
  <Button
    variant="ghost"
    onClick={() => setRoute("equipment")}
    className="text-sm"
  >
    ← Ко всему оборудованию
  </Button>
  <Button
    className="bg-sky-700 hover:bg-sky-800"
    onClick={() => startOrderFromSolution(selectedEquipment)}
  >
    Оставить заявку
  </Button>
</div>
                  </>
                );
              })()}
            </motion.section>
          )}

          {route === "contacts" && (
  <motion.section
    key="contacts"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    className="py-8 sm:py-10"
  >
    <SectionTitle
      title="Контакты"
      subtitle="Свяжитесь с нами или приезжайте — подскажем по газам, оборудованию и решениям."
    />

    <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
      {/* Офис продаж */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg uppercase">
            Офис продаж
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <div>
            <div className="text-xs text-slate-500 uppercase mb-1">
              Адрес
            </div>
            <button
              type="button"
              onClick={() =>
                window.open(officeMapUrl, "_blank", "noopener,noreferrer")
              }
              className="inline-flex items-start gap-2 text-left text-sky-700 hover:text-sky-800 hover:underline underline-offset-2"
            >
              <MapPin className="w-4 h-4 mt-[2px] flex-shrink-0" />
              <span>{CONFIG.OFFICE_ADDR}</span>
            </button>
            <div className="text-[11px] text-slate-500">
              Нажмите на адрес, чтобы открыть Яндекс.Карты.
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 uppercase mb-1">
              Телефон
            </div>
            <a
              href={CONFIG.PHONE_TEL}
              className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline underline-offset-2"
            >
              <Phone className="w-4 h-4" />
              <span>{CONFIG.PHONE_DISPLAY}</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Производственная площадка */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg uppercase">
            Производство / склад
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <div>
            <div className="text-xs text-slate-500 uppercase mb-1">
              Адрес
            </div>
            <button
              type="button"
              onClick={() =>
                window.open(prodMapUrl, "_blank", "noopener,noreferrer")
              }
              className="inline-flex items-start gap-2 text-left text-sky-700 hover:text-sky-800 hover:underline underline-offset-2"
            >
              <MapPin className="w-4 h-4 mt-[2px] flex-shrink-0" />
              <span>{CONFIG.PROD_ADDR}</span>
            </button>
            <div className="text-[11px] text-slate-500">
              Адрес также открывается в Яндекс.Картах по клику.
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Отгрузка по согласованному времени. Уточните график у менеджера
            по телефону.
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Карта (основной адрес) */}
    <Card className="bg-white/80 border-sky-100">
  <CardHeader>
    <CardTitle className="text-base sm:text-lg uppercase">
      Как нас найти на карте
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="w-full rounded-xl border border-sky-100 overflow-hidden bg-slate-100">
      <iframe
        title="Карта — Машпромстрой"
        src={CONFIG.MAP_IFRAME_SRC}
        className="w-full h-72 md:h-96"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      />
    </div>

    <div className="mt-2 text-xs text-slate-500">
      Вы можете перемещать карту, увеличивать масштаб и строить маршрут.
    </div>
  </CardContent>
</Card>
  </motion.section>
)}
          {route === "order" && (
            <motion.section
              key="order"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="py-8 sm:py-10"
            >
              <SectionTitle
                title="Оформление заявки"
                subtitle="Заполните параметры — мы свяжемся для уточнения деталей"
              />

              <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                {/* Итоговый товар/услуга */}
                <div className="md:col-span-1">
                  <Card className="bg-white/80 border-sky-100">
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base uppercase">
                        Что вы заказываете
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-slate-700">
                      <div className="font-medium break-words">
                        {productTitle || "Не выбрано"}
                      </div>
                      {productDesc && (
                        <div className="text-xs text-slate-600 break-words">
                          {productDesc}
                        </div>
                      )}
                      {productUses?.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                            Области применения
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {productUses.map((u) => (
                              <Tag key={u}>{u}</Tag>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedVariant && (
                        <div className="mt-2 text-xs text-slate-600">
                          Вариант:{" "}
                          <span className="font-medium">
                            {selectedVariant}
                          </span>
                        </div>
                      )}
                      {!productTitle && (
                        <div className="text-xs text-red-500">
                          Вернитесь в каталог и выберите товар/услугу.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Форма заказа */}
                <div className="md:col-span-2 space-y-4">
                  {!skipOrderSteps && (
                    <Card className="bg-white/80 border-sky-100">
                      <CardHeader>
                        <CardTitle className="text-sm sm:text-base uppercase">
                          1. Выбор тары и формата
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm text-slate-700">
                        <div>
                          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                            Объём баллона
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {CYLINDER_SIZES.map((s) => (
                              <Cylinder
                                key={s}
                                size={s}
                                selected={cylinder === s}
                                onClick={() => setCylinder(s)}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                              Ваша тара или наша
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {OWNERSHIP.map((o) => (
                                <button
                                  key={o.id}
                                  type="button"
                                  onClick={() => setOwnership(o.label)}
                                  className={classNames(
                                    "px-3 py-2 rounded-lg border text-xs sm:text-sm",
                                    ownership === o.label
                                      ? "border-sky-500 bg-sky-50 text-sky-700"
                                      : "border-sky-100 hover:bg-sky-50"
                                  )}
                                >
                                  {o.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                              Доставка или самовывоз
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {DELIVERY.map((d) => (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => setDelivery(d.label)}
                                  className={classNames(
                                    "px-3 py-2 rounded-lg border text-xs sm:text-sm",
                                    delivery === d.label
                                      ? "border-sky-500 bg-sky-50 text-sky-700"
                                      : "border-sky-100 hover:bg-sky-50"
                                  )}
                                >
                                  {d.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-white/80 border-sky-100">
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base uppercase">
                        {skipOrderSteps
                          ? "Контакты и комментарий"
                          : "2. Контакты и комментарий"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-700">
                      <Input
                        type="tel"
                        placeholder="Телефон для связи"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Регион / город"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      />
                      <Textarea
                        rows={4}
                        placeholder={
                          skipOrderSteps
                            ? "Опишите объект, объёмы, удобное время звонка..."
                            : "Дополнительные пожелания: график поставок, примерные объёмы, удобное время звонка..."
                        }
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <div className="flex flex-wrap justify-between items-center gap-3 mt-3">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            // Вернуться к каталогу
                            setRoute("catalog");
                          }}
                          className="text-sm"
                        >
                          ← Вернуться в каталог
                        </Button>
                        <Button
                          className="bg-sky-600 hover:bg-sky-700"
                          disabled={!canSubmit}
                          onClick={submitOrder}
                        >
                          Отправить заявку
                        </Button>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Заявка отправляется в Telegram менеджеру. Он уточнит
                        детали, согласует цену и сроки доставки/отгрузки.
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Нотификация */}
      <AnimatePresence>
        {notice.open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-3"
          >
            <Card className="bg-white/90 border-sky-200 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase">
                  {notice.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600">
                {notice.description}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Футер */}
      <footer className="mt-8 border-t border-sky-100 bg-white/60">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {CONFIG.BRAND}. Все права защищены.
          </div>
          <div className="flex flex-wrap gap-2">
            <span>Промышленные и пищевые газы, оборудование и сервис.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Простой ErrorBoundary, который оборачивает всё приложение
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App error boundary:", error, info);
  }

  render() {
    // eslint-disable-next-line react/prop-types
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6 text-center space-y-3">
            <div className="text-lg font-semibold">
              Что-то пошло не так 😅
            </div>
            <div className="text-sm text-slate-600">
              Попробуйте обновить страницу. Если ошибка повторяется — дайте
              знать разработчику.
            </div>
          </div>
        </div>
      );
    }

    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}