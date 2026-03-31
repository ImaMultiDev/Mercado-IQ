"use server";

import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "@/lib/prisma";
import { observationCreateSchema } from "@/lib/validators";

export type ActionResult = { ok: true } | { ok: false; message: string };

export async function createObservation(formData: FormData): Promise<ActionResult> {
  const raw = {
    productId: String(formData.get("productId") ?? ""),
    price: formData.get("price"),
    condition: String(formData.get("condition") ?? ""),
    source: String(formData.get("source") ?? ""),
    observedAt: formData.get("observedAt"),
  };
  const parsed = observationCreateSchema.safeParse({
    productId: raw.productId,
    price: raw.price,
    condition: raw.condition,
    source: raw.source,
    observedAt: raw_observedAtToDate(raw.observedAt),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Datos no válidos",
    };
  }
  await prisma.priceObservation.create({
    data: {
      productId: parsed.data.productId,
      price: new Decimal(parsed.data.price),
      condition: parsed.data.condition,
      source: parsed.data.source.trim(),
      observedAt: parsed.data.observedAt ?? new Date(),
    },
  });
  revalidatePath(`/products/${parsed.data.productId}`);
  revalidatePath("/products");
  revalidatePath("/");
  return { ok: true };
}

function raw_observedAtToDate(v: FormDataEntryValue | null): string | undefined {
  if (v === null || v === "") return undefined;
  return String(v);
}

export async function deleteObservation(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  const productId = String(formData.get("productId") ?? "").trim();
  if (!id || !productId) return { ok: false, message: "Datos incompletos" };
  await prisma.priceObservation.delete({ where: { id } });
  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
  revalidatePath("/");
  return { ok: true };
}
