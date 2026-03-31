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
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Categorías</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Ej.: bicis spinning, remoergómetros, elípticas…
          </p>
        </div>
        <Link href="/products" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
          Productos
        </Link>
      </div>

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
