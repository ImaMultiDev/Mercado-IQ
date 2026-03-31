import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CategoryForms } from "@/components/categories/category-forms";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="mx-auto max-w-xl">
      <header className="flex items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Categorías</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Ej.: bicis spinning, remoergómetros, elípticas…
          </p>
        </div>
        <Link
          href="/products"
          className="shrink-0 text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Productos
        </Link>
      </header>

      <CategoryForms
        initialCategories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          productCount: c._count.products,
        }))}
      />
    </div>
  );
}
