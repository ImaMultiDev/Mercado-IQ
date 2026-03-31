import Link from "next/link";
import { formatEur } from "@/lib/money";

const thumbClass =
  "relative size-[3.25rem] shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-raised)]";

type Props = {
  id: string;
  brand: string;
  model: string;
  categoryName: string;
  imageUrl: string | null;
  obsCount: number;
  minPrice: number | null;
  avgPrice: number | null;
  maxPrice: number | null;
  targetPrice: number | null;
  /** inicio: mínimo muy visible; listado: fila densa con rango */
  layout: "home" | "list";
};

function Thumb({ imageUrl, title }: { imageUrl: string | null; title: string }) {
  return (
    <div className={thumbClass}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL externa del producto
        <img src={imageUrl} alt="" className="size-full object-cover" loading="lazy" />
      ) : (
        <div
          className="flex size-full items-center justify-center bg-[var(--accent-dim)] text-[11px] font-medium text-[var(--muted-2)]"
          aria-hidden
        >
          {title
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 3) || "—"}
        </div>
      )}
    </div>
  );
}

export function ProductRowCard({
  id,
  brand,
  model,
  categoryName,
  imageUrl,
  obsCount,
  minPrice,
  avgPrice,
  maxPrice,
  targetPrice,
  layout,
}: Props) {
  const title = `${brand} ${model}`;
  const href = `/products/${id}`;

  return (
    <li className="border-b border-[var(--border)] last:border-b-0">
      <Link
        href={href}
        className="group flex gap-3 px-3 py-3 transition-colors hover:bg-[var(--hover)] sm:gap-4 sm:px-4"
      >
        <Thumb imageUrl={imageUrl} title={title} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-medium text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
              {brand} {model}
            </span>
            <span className="rounded bg-[var(--surface-raised)] px-1.5 py-px text-[11px] text-[var(--muted)]">
              {categoryName}
            </span>
          </div>

          {layout === "home" && (
            <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-2">
              {obsCount === 0 ? (
                <p className="text-xs text-[var(--muted)]">Sin precios observados aún</p>
              ) : (
                <>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-2)]">
                      Mín. mercado
                    </p>
                    <p className="numeric text-lg font-semibold leading-tight text-[var(--accent)]">
                      {formatEur(minPrice)}
                    </p>
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    <span className="numeric">μ {formatEur(avgPrice)}</span>
                    <span className="mx-1.5 text-[var(--border)]">·</span>
                    <span>{obsCount} obs.</span>
                  </div>
                </>
              )}
              {targetPrice != null && (
                <div className="text-xs">
                  <span className="text-[var(--muted-2)]">Objetivo compra </span>
                  <span className="numeric font-medium text-[var(--text)]">
                    {formatEur(targetPrice)}
                  </span>
                </div>
              )}
            </div>
          )}

          {layout === "list" && (
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm">
                {obsCount === 0 ? (
                  <span className="text-[var(--muted)]">Sin observaciones</span>
                ) : (
                  <>
                    <span>
                      <span className="text-[var(--muted-2)]">Mín. </span>
                      <span className="numeric font-semibold text-[var(--accent)]">
                        {formatEur(minPrice)}
                      </span>
                    </span>
                    <span className="text-[var(--muted)]">
                      <span className="text-[var(--muted-2)]">Máx. </span>
                      <span className="numeric">{formatEur(maxPrice)}</span>
                    </span>
                    <span className="text-[var(--muted)]">
                      μ <span className="numeric font-medium">{formatEur(avgPrice)}</span>
                    </span>
                  </>
                )}
              </div>
              {targetPrice != null && (
                <div className="shrink-0 text-xs sm:text-right">
                  <span className="text-[var(--muted-2)]">Objetivo </span>
                  <span className="numeric font-medium text-[var(--text)]">
                    {formatEur(targetPrice)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}
