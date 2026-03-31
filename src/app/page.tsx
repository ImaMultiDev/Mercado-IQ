import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEur } from "@/lib/money";
import { computePriceStats } from "@/lib/price-stats";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [productCount, categoryCount, observationCount, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.priceObservation.count(),
      prisma.product.findMany({
        take: 6,
        orderBy: { updatedAt: "desc" },
        include: {
          category: true,
          observations: { select: { price: true } },
        },
      }),
    ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight">Resumen</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Inteligencia de mercado para compraventa · productos voluminosos.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Productos" value={String(productCount)} href="/products" />
        <Stat label="Categorías" value={String(categoryCount)} href="/categories" />
        <Stat
          label="Precios registrados"
          value={String(observationCount)}
          href="/products"
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/products?q="
          className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white"
        >
          Buscar productos
        </Link>
        <Link
          href="/products/new"
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        >
          Nuevo producto
        </Link>
        <Link
          href="/calculator"
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        >
          Calculadora
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
          Actividad reciente
        </h2>
        {recentProducts.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Aún no hay productos. Crea una{" "}
            <Link href="/categories" className="text-[var(--accent)] underline">
              categoría
            </Link>{" "}
            y añade el primero.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--border)] border border-[var(--border)] rounded-lg bg-[var(--surface)]">
            {recentProducts.map((p) => {
              const st = computePriceStats(p.observations.map((o) => o.price));
              return (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.id}`}
                    className="flex flex-col gap-0.5 px-3 py-2.5 hover:bg-[var(--hover)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span>
                      <span className="font-medium">
                        {p.brand} {p.model}
                      </span>
                      <span className="ml-2 text-xs text-[var(--muted)]">
                        {p.category.name}
                      </span>
                    </span>
                    <span className="numeric text-sm text-[var(--muted)]">
                      {st.count === 0
                        ? "Sin observaciones"
                        : `μ ${formatEur(st.avg)} · ${st.count} obs.`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 hover:bg-[var(--hover)]"
    >
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-[var(--muted)]">{label}</div>
    </Link>
  );
}
