"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProduct, updateProduct } from "@/server/actions/products";
import type { Category } from "@/generated/prisma/client";

type ProductRow = {
  id: string;
  categoryId: string;
  brand: string;
  model: string;
  /** Cadenas serializables (nunca Decimal de Prisma en props de cliente). */
  newPrice: string | null;
  targetPrice: string | null;
  notes: string | null;
  imageUrl: string | null;
};

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2";

export function ProductForm({
  categories,
  mode,
  product,
}: {
  categories: Pick<Category, "id" | "name">[];
  mode: "create" | "edit";
  product?: ProductRow;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const action = mode === "create" ? createProduct : updateProduct;
    const r = await action(fd);
    if (!r.ok) {
      setError(r.message);
      return;
    }
    if (mode === "edit" && product?.id) {
      router.push(`/products/${product.id}`);
    } else {
      router.push("/products");
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "edit" && <input type="hidden" name="id" value={product?.id} />}
      <div>
        <label htmlFor="categoryId" className="text-sm font-medium">
          Categoría
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className={inputClass}
          defaultValue={product?.categoryId}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="brand" className="text-sm font-medium">
            Marca
          </label>
          <input
            id="brand"
            name="brand"
            required
            className={inputClass}
            defaultValue={product?.brand}
          />
        </div>
        <div>
          <label htmlFor="model" className="text-sm font-medium">
            Modelo
          </label>
          <input
            id="model"
            name="model"
            required
            className={inputClass}
            defaultValue={product?.model}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="newPrice" className="text-sm font-medium">
            Precio nuevo (ref.)
          </label>
          <input
            id="newPrice"
            name="newPrice"
            type="text"
            inputMode="decimal"
            placeholder="Opcional"
            className={`numeric ${inputClass}`}
            defaultValue={product?.newPrice ?? undefined}
          />
        </div>
        <div>
          <label htmlFor="targetPrice" className="text-sm font-medium">
            Precio objetivo compra
          </label>
          <input
            id="targetPrice"
            name="targetPrice"
            type="text"
            inputMode="decimal"
            placeholder="Opcional"
            className={`numeric ${inputClass}`}
            defaultValue={product?.targetPrice ?? undefined}
          />
        </div>
      </div>
      <div>
        <label htmlFor="imageUrl" className="text-sm font-medium">
          URL imagen (Cloudinary u otro)
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://…"
          className={inputClass}
          defaultValue={product?.imageUrl ?? undefined}
        />
      </div>
      <div>
        <label htmlFor="notes" className="text-sm font-medium">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className={inputClass}
          defaultValue={product?.notes ?? undefined}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-card)]"
      >
        {mode === "create" ? "Guardar producto" : "Actualizar"}
      </button>
    </form>
  );
}
