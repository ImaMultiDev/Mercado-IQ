import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { computePriceStats } from "@/lib/price-stats";
import { ProductRowCard } from "@/components/products/product-row-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [productCount, categoryCount, observationCount, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.priceObservation.count(),
      prisma.product.findMany({
        take: 8,
        orderBy: { updatedAt: "desc" },
        include: {
          category: true,
          observations: { select: { price: true } },
        },
      }),
    ]);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="border-b border-[var(--border)] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
          Resumen
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          Vista rápida del mercado observado: precio mínimo por artículo, objetivo de compra y accesos
          directos.
        </p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Productos" value={String(productCount)} href="/products" />
        <Stat label="Categorías" value={String(categoryCount)} href="/categories" />
        <Stat
          label="Precios en histórico"
          value={String(observationCount)}
          href="/products"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-card)] transition-opacity hover:opacity-90"
        >
          Buscar productos
        </Link>
        <Link
          href="/products/new"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--muted-2)] hover:bg-[var(--hover)]"
        >
          Nuevo producto
        </Link>
        <Link
          href="/calculator"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--muted-2)] hover:bg-[var(--hover)]"
        >
          Calculadora rentabilidad
        </Link>
      </div>

      <section className="mt-12" aria-labelledby="recent-heading">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="recent-heading"
            className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]"
          >
            Actividad reciente
          </h2>
          <Link
            href="/products"
            className="text-xs font-medium text-[var(--accent)] hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-raised)] px-4 py-8 text-center text-sm text-[var(--muted)]">
            Aún no hay productos. Crea una{" "}
            <Link href="/categories" className="font-medium text-[var(--accent)] underline">
              categoría
            </Link>{" "}
            y añade el primero.
          </p>
        ) : (
          <ul
            className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]"
            role="list"
          >
            {recentProducts.map((p) => {
              const st = computePriceStats(p.observations.map((o) => o.price));
              const target =
                p.targetPrice != null ? Number(p.targetPrice) : null;
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
                  layout="home"
                />
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
      className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[var(--shadow-card)] transition-colors hover:border-[var(--muted-2)] hover:bg-[var(--hover)]"
    >
      <div className="text-2xl font-semibold tabular-nums text-[var(--text)]">
        {value}
      </div>
      <div className="mt-1 text-xs text-[var(--muted)]">{label}</div>
    </Link>
  );
}
