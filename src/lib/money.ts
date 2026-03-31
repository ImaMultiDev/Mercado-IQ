import { Decimal } from "@prisma/client/runtime/client";

const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

export function formatEur(value: number | Decimal | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return "—";
  return eur.format(n);
}

export function parseMoneyInput(raw: string): number | null {
  const normalized = raw.replace(",", ".").replace(/\s/g, "").trim();
  if (!normalized) return null;
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}
