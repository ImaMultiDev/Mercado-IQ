import Link from "next/link";
import { notFound } from "next/navigation";
import { ObservationForm } from "@/components/products/observation-form";
import { ProductForm } from "@/components/products/product-form";
import { ProductDeleteButton } from "@/components/products/product-delete-button";
import { conditionLabel } from "@/lib/condition-labels";
import { formatEur } from "@/lib/money";
import { computePriceStats } from "@/lib/price-stats";
import { prisma } from "@/lib/prisma";
import { deleteObservationAction } from "@/server/actions/observation-delete";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      observations: { orderBy: { observedAt: "desc" } },
    },
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const stats = computePriceStats(product.observations.map((o) => o.price));
  const target = product.targetPrice;
  const vsTarget =
    stats.avg != null && target != null
      ? stats.avg <= Number(target)
      : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-[var(--muted)]">{product.category.name}</p>
          <h1 className="text-xl font-semibold tracking-tight">
            {product.brand} {product.model}
          </h1>
        </div>
        <Link href="/products" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
          ← Lista
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_160px]">
        <div className="space-y-4">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="text-sm font-medium text-[var(--muted)]">Referencias</h2>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[var(--muted)]">Precio nuevo (ref.)</dt>
                <dd className="numeric font-medium">{formatEur(product.newPrice)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted)]">Precio objetivo compra</dt>
                <dd className="numeric font-medium">{formatEur(product.targetPrice)}</dd>
              </div>
            </dl>
            {product.notes && (
              <p className="mt-3 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted)]">
                {product.notes}
              </p>
            )}
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="text-sm font-medium text-[var(--muted)]">
              Estadísticas observaciones
            </h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-[var(--muted)]">Mínimo</dt>
                <dd className="numeric text-lg font-semibold">{formatEur(stats.min)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted)]">Media</dt>
                <dd className="numeric text-lg font-semibold">{formatEur(stats.avg)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted)]">Máximo</dt>
                <dd className="numeric text-lg font-semibold">{formatEur(stats.max)}</dd>
              </div>
            </dl>
            {vsTarget !== null && (
              <p
                className={`mt-3 text-sm ${vsTarget ? "text-teal-600 dark:text-teal-400" : "text-amber-700 dark:text-amber-400"}`}
              >
                {vsTarget
                  ? "La media actual está por debajo o en tu objetivo."
                  : "La media actual supera tu precio objetivo de compra."}
              </p>
            )}
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium">Historial de precios</h2>
              <span className="text-xs text-[var(--muted)]">{stats.count} registros</span>
            </div>
            {product.observations.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--muted)]">
                Añade el primer precio observado.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-[var(--border)]">
                {product.observations.map((o) => (
                  <li
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
                  >
                    <span className="numeric font-medium">{formatEur(o.price)}</span>
                    <span className="text-[var(--muted)]">
                      {conditionLabel(o.condition)} · {o.source}
                    </span>
                    <span className="numeric text-xs text-[var(--muted)]">
                      {o.observedAt.toLocaleDateString("es-ES")}
                    </span>
                    <form action={deleteObservationAction}>
                      <input type="hidden" name="id" value={o.id} />
                      <input type="hidden" name="productId" value={product.id} />
                      <button
                        type="submit"
                        className="text-xs text-red-600 hover:underline dark:text-red-400"
                      >
                        Eliminar
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              <ObservationForm productId={product.id} />
            </div>
          </section>
        </div>

        <div className="space-y-4">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- URLs externas (Cloudinary, etc.)
            <img
              src={product.imageUrl}
              alt=""
              className="aspect-square w-full rounded-lg border border-[var(--border)] object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
              Sin imagen
            </div>
          )}
        </div>
      </div>

      <section className="mt-10 border-t border-[var(--border)] pt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
          Editar ficha
        </h2>
        <div className="mt-4">
          <ProductForm
            categories={categories}
            mode="edit"
            product={{
              id: product.id,
              categoryId: product.categoryId,
              brand: product.brand,
              model: product.model,
              newPrice: product.newPrice,
              targetPrice: product.targetPrice,
              notes: product.notes,
              imageUrl: product.imageUrl,
            }}
          />
        </div>
        <div className="mt-6">
          <ProductDeleteButton productId={product.id} />
        </div>
      </section>
    </div>
  );
}
