import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEur } from "@/lib/money";
import { computePriceStats } from "@/lib/price-stats";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Productos</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Búsqueda por marca, modelo o notas.
          </p>
        </div>
        <Link
          href="/products/new"
          className="shrink-0 rounded-md bg-[var(--accent)] px-3 py-2 text-center text-sm font-medium text-white"
        >
          + Añadir producto
        </Link>
      </div>

      <form method="get" action="/products" className="mt-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Buscar…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 outline-none ring-[var(--accent)] focus:ring-2"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm"
        >
          Buscar
        </button>
      </form>

      <p className="mt-2 text-xs text-[var(--muted)]">
        {products.length} resultado{products.length === 1 ? "" : "s"}
        {query ? ` · “${query}”` : ""}
      </p>

      <ul className="mt-4 divide-y divide-[var(--border)] border border-[var(--border)] rounded-lg bg-[var(--surface)]">
        {products.length === 0 ? (
          <li className="px-3 py-8 text-center text-sm text-[var(--muted)]">
            No hay productos.
            <Link href="/products/new" className="ml-1 text-[var(--accent)] underline">
              Crear uno
            </Link>
          </li>
        ) : (
          products.map((p) => {
            const st = computePriceStats(p.observations.map((o) => o.price));
            return (
              <li key={p.id}>
                <Link
                  href={`/products/${p.id}`}
                  className="flex flex-col gap-1 px-3 py-3 hover:bg-[var(--hover)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <span className="font-medium">
                      {p.brand} {p.model}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)] sm:inline sm:mt-0 sm:ml-2">
                      {p.category.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    {p.targetPrice != null && (
                      <span className="text-xs">
                        Objetivo{" "}
                        <span className="numeric font-medium">
                          {formatEur(p.targetPrice)}
                        </span>
                      </span>
                    )}
                    <span className="numeric text-[var(--muted)]">
                      {st.count === 0
                        ? "—"
                        : `${formatEur(st.min)} … ${formatEur(st.max)} · μ ${formatEur(st.avg)}`}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
