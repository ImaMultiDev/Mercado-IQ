import type { ProductCondition } from "@/generated/prisma/enums";

const labels: Record<ProductCondition, string> = {
  NEW: "Nuevo",
  USED: "Usado",
  REFURBISHED: "Reacondicionado",
};

export function conditionLabel(c: ProductCondition): string {
  return labels[c] ?? c;
}
