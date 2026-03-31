"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductCondition } from "@/generated/prisma/enums";
import { createObservation } from "@/server/actions/observations";
import { conditionLabel } from "@/lib/condition-labels";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2";

export function ObservationForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const r = await createObservation(fd);
    if (!r.ok) {
      setError(r.message);
      return;
    }
    e.currentTarget.reset();
    router.refresh();
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <input type="hidden" name="productId" value={productId} />
      <div>
        <label htmlFor="price" className="text-xs font-medium text-[var(--muted)]">
          Precio €
        </label>
        <input
          id="price"
          name="price"
          type="text"
          inputMode="decimal"
          required
          className={`numeric ${inputClass}`}
        />
      </div>
      <div>
        <label htmlFor="condition" className="text-xs font-medium text-[var(--muted)]">
          Estado
        </label>
        <select id="condition" name="condition" required className={inputClass}>
          {(
            [
              ProductCondition.NEW,
              ProductCondition.USED,
              ProductCondition.REFURBISHED,
            ] as const
          ).map((c) => (
            <option key={c} value={c}>
              {conditionLabel(c)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="source" className="text-xs font-medium text-[var(--muted)]">
          Fuente
        </label>
        <input
          id="source"
          name="source"
          type="text"
          required
          placeholder="Wallapop…"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="observedAt" className="text-xs font-medium text-[var(--muted)]">
          Fecha
        </label>
        <input
          id="observedAt"
          name="observedAt"
          type="date"
          defaultValue={today}
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-1 rounded-md bg-[var(--text)] px-3 py-2 text-sm font-medium text-[var(--background)] dark:bg-[var(--foreground)] dark:text-[var(--background)]"
        >
          Añadir observación
        </button>
      </div>
    </form>
  );
}
