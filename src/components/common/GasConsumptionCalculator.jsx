// src/components/common/GasConsumptionCalculator.jsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function GasConsumptionCalculator() {
  const [current, setCurrent] = useState(120);
  const [flow, setFlow] = useState(12);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [daysPerMonth, setDaysPerMonth] = useState(22);

  const litersPerHour = flow * 60;
  const totalLitersMonth = litersPerHour * hoursPerDay * daysPerMonth;
  const totalM3 = totalLitersMonth / 1000;

  const cylinderVolumeM3 = (40 * 150) / 1000; // 40 л * 150 атм ≈ 6 м³
  const cylinders = totalM3 > 0 ? Math.ceil(totalM3 / cylinderVolumeM3) : 0;

  return (
    <Card className="bg-white/80 border-sky-100 overflow-hidden mb-6">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg uppercase">
          Калькулятор расхода газа
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-700">
        <p className="text-xs sm:text-sm text-slate-600">
          Оцените, сколько газа потребуется при сварке. Цифры примерные, но
          хорошо помогают планировать поставки.
        </p>

        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-600">Сварочный ток, А</label>
            <Input
              type="number"
              min={10}
              max={400}
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Расход газа, л/мин</label>
            <Input
              type="number"
              min={5}
              max={30}
              value={flow}
              onChange={(e) => setFlow(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Часов сварки в день</label>
            <Input
              type="number"
              min={1}
              max={24}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Дней в месяц</label>
            <Input
              type="number"
              min={1}
              max={31}
              value={daysPerMonth}
              onChange={(e) => setDaysPerMonth(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="mt-3 grid md:grid-cols-3 gap-3 items-center">
          <div>
            <div className="text-xs text-slate-500">Расход за месяц</div>
            <div className="text-lg font-semibold">
              {totalM3 > 0 ? totalM3.toFixed(1) : "0.0"} м³
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">
              Ориентировочно баллонов 40 л (150 атм)
            </div>
            <div className="text-lg font-semibold">{cylinders} шт</div>
          </div>
          <div className="text-xs text-slate-500 md:text-right">
            Для точного подбора учтём режимы, тип шва и газ. Оставьте заявку —
            менеджер уточнит детали.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
