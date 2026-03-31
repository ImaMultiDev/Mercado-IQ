/** Genera un slug URL-seguro a partir de texto visible (nombres de categoría, etc.). */
export function slugify(input: string): string {
  const s = input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return s.length > 0 ? s : "item";
}
