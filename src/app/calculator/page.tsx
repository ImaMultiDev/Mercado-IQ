import { ProfitCalculator } from "@/components/calculator/profit-calculator";

export const metadata = {
  title: "Calculadora de rentabilidad · Mercado IQ",
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold tracking-tight">Rentabilidad</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Coste total incluye compra, portes (× envíos) y reparación / limpieza.
      </p>
      <div className="mt-8">
        <ProfitCalculator />
      </div>
    </div>
  );
}
