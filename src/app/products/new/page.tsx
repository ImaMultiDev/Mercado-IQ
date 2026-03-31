import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/products/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  if (categories.length === 0) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="text-xl font-semibold">Nuevo producto</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Primero necesitas al menos una categoría.
        </p>
        <Link
          href="/categories"
          className="mt-4 inline-block text-sm text-[var(--accent)] underline"
        >
          Ir a categorías
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Nuevo producto</h1>
        <Link href="/products" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
          Volver
        </Link>
      </div>
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
