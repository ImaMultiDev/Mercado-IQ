"use client";

import { useMemo, useState } from "react";
import { parseMoneyInput } from "@/lib/money";

type Mode = "direct" | "refurb";

const field =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2";

export function ProfitCalculator() {
  const [mode, setMode] = useState<Mode>("direct");
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");
  const [transport, setTransport] = useState("");
  const [shipments, setShipments] = useState<1 | 2>(1);
  const [repair, setRepair] = useState("");

  const result = useMemo(() => {
    const buyN = parseMoneyInput(buy) ?? 0;
    const sellN = parseMoneyInput(sell) ?? 0;
    const transportN = parseMoneyInput(transport) ?? 0;
    const repairN = parseMoneyInput(repair) ?? 0;
    const logistics = transportN * shipments;
    const totalCost = buyN + logistics + repairN;
    const profit = sellN - totalCost;
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : null;
    return { totalCost, profit, roi, logistics };
  }, [buy, sell, transport, shipments, repair]);

  return (
    <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <fieldset>
        <legend className="text-sm font-medium text-[var(--muted)]">Escenario</legend>
        <div className="mt-2 flex gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="mode"
              checked={mode === "direct"}
              onChange={() => {
                setMode("direct");
                setRepair("");
              }}
            />
            Reventa directa
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="mode"
              checked={mode === "refurb"}
              onChange={() => setMode("refurb")}
            />
            Con reacondicionamiento
          </label>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="calc-buy" className="text-sm font-medium">
            Precio compra €
          </label>
          <input
            id="calc-buy"
            value={buy}
            onChange={(e) => setBuy(e.target.value)}
            inputMode="decimal"
            className={`numeric ${field}`}
          />
        </div>
        <div>
          <label htmlFor="calc-sell" className="text-sm font-medium">
            Venta estimada €
          </label>
          <input
            id="calc-sell"
            value={sell}
            onChange={(e) => setSell(e.target.value)}
            inputMode="decimal"
            className={`numeric ${field}`}
          />
        </div>
        <div>
          <label htmlFor="calc-transport" className="text-sm font-medium">
            Coste transporte (por envío) €
          </label>
          <input
            id="calc-transport"
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            inputMode="decimal"
            className={`numeric ${field}`}
          />
        </div>
        <div>
          <label htmlFor="calc-shipments" className="text-sm font-medium">
            Número de portes
          </label>
          <select
            id="calc-shipments"
            value={shipments}
            onChange={(e) => setShipments(Number(e.target.value) as 1 | 2)}
            className={field}
          >
            <option value={1}>1 (solo ida o solo vuelta)</option>
            <option value={2}>2 (ida y vuelta / dos tramos)</option>
          </select>
        </div>
        {mode === "refurb" && (
          <div className="sm:col-span-2">
            <label htmlFor="calc-repair" className="text-sm font-medium">
              Reparación / limpieza €
            </label>
            <input
              id="calc-repair"
              value={repair}
              onChange={(e) => setRepair(e.target.value)}
              inputMode="decimal"
              className={`numeric ${field}`}
            />
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border)] pt-4">
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-4 sm:block">
            <dt className="text-[var(--muted)]">Coste logística</dt>
            <dd className="numeric font-medium">
              {result.logistics.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}
            </dd>
          </div>
          <div className="flex justify-between gap-4 sm:block">
            <dt className="text-[var(--muted)]">Coste total</dt>
            <dd className="numeric font-medium">
              {result.totalCost.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}
            </dd>
          </div>
          <div className="flex justify-between gap-4 sm:block">
            <dt className="text-[var(--muted)]">Beneficio neto</dt>
            <dd
              className={`numeric text-lg font-semibold ${result.profit >= 0 ? "text-teal-600 dark:text-teal-400" : "text-red-600 dark:text-red-400"}`}
            >
              {result.profit.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}
            </dd>
          </div>
          <div className="flex justify-between gap-4 sm:block">
            <dt className="text-[var(--muted)]">ROI</dt>
            <dd className="numeric text-lg font-semibold">
              {result.roi === null
                ? "—"
                : `${result.roi.toFixed(1)} %`}
            </dd>
          </div>
        </dl>
        {mode === "direct" && (
          <p className="mt-3 text-xs text-[var(--muted)]">
            En reventa directa el coste de reparación se considera 0.
          </p>
        )}
      </div>
    </div>
  );
}
