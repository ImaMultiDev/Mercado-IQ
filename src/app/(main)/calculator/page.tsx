import { ProfitCalculator } from "@/components/calculator/profit-calculator";

export const metadata = {
  title: "Calculadora de rentabilidad · Mercado IQ",
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-xl">
      <header className="border-b border-[var(--border)] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Rentabilidad</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Coste total incluye compra, portes (× envíos) y reparación / limpieza.
        </p>
      </header>
      <div className="mt-8">
        <ProfitCalculator />
      </div>
    </div>
  );
}
