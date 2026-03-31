import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { computePriceStats } from "@/lib/price-stats";
import { ProductRowCard } from "@/components/products/product-row-card";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const products = await prisma.product.findMany({
    where: query
      ? {
          OR: [
            { brand: { contains: query, mode: "insensitive" } },
            { model: { contains: query, mode: "insensitive" } },
            { notes: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ brand: "asc" }, { model: "asc" }],
    include: {
      category: true,
      observations: { select: { price: true } },
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
            Productos
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Búsqueda por marca, modelo o notas. Cada fila muestra foto, mínimo observado y objetivo.
          </p>
        </div>
        <Link
          href="/products/new"
          className="shrink-0 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-center text-sm font-medium text-white shadow-[var(--shadow-card)] transition-opacity hover:opacity-90"
        >
          + Añadir producto
        </Link>
      </header>

      <form method="get" action="/products" className="mt-8 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Buscar por marca, modelo…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text)] outline-none ring-[var(--accent)] placeholder:text-[var(--muted-2)] focus:ring-2"
          autoFocus
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--hover)]"
        >
          Buscar
        </button>
      </form>

      <p className="mt-3 text-xs text-[var(--muted-2)]">
        {products.length} resultado{products.length === 1 ? "" : "s"}
        {query ? ` · «${query}»` : ""}
      </p>

      <ul
        className="mt-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]"
        role="list"
      >
        {products.length === 0 ? (
          <li className="px-4 py-12 text-center text-sm text-[var(--muted)]">
            No hay productos.
            <Link href="/products/new" className="ml-1 font-medium text-[var(--accent)] underline">
              Crear uno
            </Link>
          </li>
        ) : (
          products.map((p) => {
            const st = computePriceStats(p.observations.map((o) => o.price));
            const target = p.targetPrice != null ? Number(p.targetPrice) : null;
            return (
              <ProductRowCard
                key={p.id}
                id={p.id}
                brand={p.brand}
                model={p.model}
                categoryName={p.category.name}
                imageUrl={p.imageUrl}
                obsCount={st.count}
                minPrice={st.min}
                avgPrice={st.avg}
                maxPrice={st.max}
                targetPrice={target}
                layout="list"
              />
            );
          })
        )}
      </ul>
    </div>
  );
}
