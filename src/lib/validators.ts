import { z } from "zod";
import { ProductCondition } from "@/generated/prisma/enums";
import { parseMoneyInput } from "@/lib/money";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Nombre obligatorio").max(120),
});

export const categoryUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
});

export const observationCreateSchema = z.object({
  productId: z.string().min(1),
  price: z.coerce.number().positive("Precio debe ser > 0"),
  condition: z.enum([
    ProductCondition.NEW,
    ProductCondition.USED,
    ProductCondition.REFURBISHED,
  ]),
  source: z.string().min(1, "Fuente obligatoria").max(200),
  observedAt: z.coerce.date().optional(),
});

export type ProductParsed = {
  categoryId: string;
  brand: string;
  model: string;
  notes?: string;
  imageUrl?: string;
  newPrice: number | null;
  targetPrice: number | null;
};

export function parseProductForm(formData: FormData): {
  ok: true;
  data: ProductParsed;
} | { ok: false; message: string; field?: string } {
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const notesRaw = String(formData.get("notes") ?? "").trim();
  const imageUrlRaw = String(formData.get("imageUrl") ?? "").trim();
  const newPriceRaw = String(formData.get("newPrice") ?? "").trim();
  const targetPriceRaw = String(formData.get("targetPrice") ?? "").trim();

  if (!categoryId)
    return { ok: false, message: "Categoría obligatoria", field: "categoryId" };
  if (!brand) return { ok: false, message: "Marca obligatoria", field: "brand" };
  if (!model) return { ok: false, message: "Modelo obligatorio", field: "model" };

  let imageUrl: string | undefined;
  if (imageUrlRaw) {
    try {
      new URL(imageUrlRaw);
      imageUrl = imageUrlRaw;
    } catch {
      return { ok: false, message: "URL de imagen no válida", field: "imageUrl" };
    }
  }

  const newPrice = newPriceRaw ? parseMoneyInput(newPriceRaw) : null;
  if (newPriceRaw && newPrice === null) {
    return { ok: false, message: "Precio nuevo no válido", field: "newPrice" };
  }
  const targetPrice = targetPriceRaw ? parseMoneyInput(targetPriceRaw) : null;
  if (targetPriceRaw && targetPrice === null) {
    return {
      ok: false,
      message: "Precio objetivo no válido",
      field: "targetPrice",
    };
  }

  return {
    ok: true,
    data: {
      categoryId,
      brand,
      model,
      notes: notesRaw || undefined,
      imageUrl,
      newPrice,
      targetPrice,
    },
  };
}

export type ProductUpdateParsed = ProductParsed & { id: string };

export function parseProductUpdateForm(formData: FormData): {
  ok: true;
  data: ProductUpdateParsed;
} | { ok: false; message: string; field?: string } {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Producto no válido" };
  const base = parseProductForm(formData);
  if (!base.ok) return base;
  return { ok: true, data: { ...base.data, id } };
}
