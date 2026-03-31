"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { categoryCreateSchema, categoryUpdateSchema } from "@/lib/validators";

export type ActionResult = { ok: true } | { ok: false; message: string };

async function uniqueSlugFromName(name: string, excludeId?: string) {
  const base = slugify(name);
  let candidate = base;
  let n = 0;
  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (!existing) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const parsed = categoryCreateSchema.safeParse({
    name: String(formData.get("name") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos no válidos" };
  }
  const slug = await uniqueSlugFromName(parsed.data.name);
  await prisma.category.create({
    data: { name: parsed.data.name, slug },
  });
  revalidatePath("/categories");
  revalidatePath("/products");
  return { ok: true };
}

export async function updateCategory(formData: FormData): Promise<ActionResult> {
  const parsed = categoryUpdateSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos no válidos" };
  }
  const slug = await uniqueSlugFromName(parsed.data.name, parsed.data.id);
  await prisma.category.update({
    where: { id: parsed.data.id },
    data: { name: parsed.data.name, slug },
  });
  revalidatePath("/categories");
  revalidatePath("/products");
  return { ok: true };
}

export async function deleteCategory(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Categoría no válida" };
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return {
      ok: false,
      message: `No se puede eliminar: hay ${count} producto(s) en esta categoría.`,
    };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/categories");
  revalidatePath("/products");
  return { ok: true };
}
