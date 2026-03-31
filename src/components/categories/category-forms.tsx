"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/server/actions/categories";

type Row = { id: string; name: string; productCount: number };

const inputClass =
  "flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-2 py-1.5 text-sm text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2";

export function CategoryForms({ initialCategories }: { initialCategories: Row[] }) {
  const router = useRouter();
  const [createError, setCreateError] = useState<string | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setCreateError(null);
    const fd = new FormData(form);
    const r = await createCategory(fd);
    if (!r.ok) {
      setCreateError(r.message);
      return;
    }
    form.reset();
    router.refresh();
  }

  async function onUpdate(id: string, form: HTMLFormElement) {
    setEditErrors((s) => ({ ...s, [id]: "" }));
    const fd = new FormData(form);
    fd.set("id", id);
    const r = await updateCategory(fd);
    if (!r.ok) {
      setEditErrors((s) => ({ ...s, [id]: r.message }));
      return;
    }
    router.refresh();
  }

  async function onDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    const r = await deleteCategory(fd);
    if (!r.ok) {
      alert(r.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="text-sm font-medium text-[var(--muted)]">Nueva categoría</h2>
        <form onSubmit={onCreate} className="mt-3 flex flex-wrap gap-2">
          <input
            name="name"
            placeholder="Nombre"
            required
            className={inputClass}
            autoComplete="off"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
          >
            Añadir
          </button>
        </form>
        {createError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{createError}</p>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-[var(--muted)]">Listado</h2>
        {initialCategories.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">Sin categorías todavía.</p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
            {initialCategories.map((c) => (
              <li key={c.id} className="p-2">
                <form
                  className="flex flex-wrap items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdate(c.id, e.currentTarget);
                  }}
                >
                  <input type="hidden" name="id" value={c.id} />
                  <input
                    name="name"
                    defaultValue={c.name}
                    className={inputClass}
                    required
                  />
                  <span className="text-xs text-[var(--muted)]">
                    {c.productCount} prod.
                  </span>
                  <button type="submit" className="text-sm text-[var(--accent)]">
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(c.id)}
                    className="text-sm text-red-600 dark:text-red-400"
                  >
                    Eliminar
                  </button>
                </form>
                {editErrors[c.id] && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {editErrors[c.id]}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
