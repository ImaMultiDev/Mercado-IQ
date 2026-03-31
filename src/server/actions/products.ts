"use server";

import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "@/lib/prisma";
import {
  parseProductForm,
  parseProductUpdateForm,
} from "@/lib/validators";

export type ActionResult = { ok: true } | { ok: false; message: string };

function toDecimal(n: number | null | undefined) {
  if (n === null || n === undefined) return undefined;
  return new Decimal(n);
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const parsed = parseProductForm(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };
  const { data } = parsed;
  await prisma.product.create({
    data: {
      categoryId: data.categoryId,
      brand: data.brand,
      model: data.model,
      newPrice: toDecimal(data.newPrice ?? undefined),
      targetPrice: toDecimal(data.targetPrice ?? undefined),
      notes: data.notes,
      imageUrl: data.imageUrl,
    },
  });
  revalidatePath("/products");
  revalidatePath("/");
  return { ok: true };
}

export async function updateProduct(formData: FormData): Promise<ActionResult> {
  const parsed = parseProductUpdateForm(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };
  const { data } = parsed;
  await prisma.product.update({
    where: { id: data.id },
    data: {
      categoryId: data.categoryId,
      brand: data.brand,
      model: data.model,
      newPrice: data.newPrice !== null ? toDecimal(data.newPrice) : null,
      targetPrice: data.targetPrice !== null ? toDecimal(data.targetPrice) : null,
      notes: data.notes ?? null,
      imageUrl: data.imageUrl ?? null,
    },
  });
  revalidatePath("/products");
  revalidatePath(`/products/${data.id}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProduct(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Producto no válido" };
  await prisma.product.delete({ where: { id } });
  revalidatePath("/products");
  revalidatePath("/");
  return { ok: true };
}
