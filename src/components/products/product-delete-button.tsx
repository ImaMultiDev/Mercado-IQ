"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProduct } from "@/server/actions/products";

export function ProductDeleteButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (!window.confirm("¿Eliminar este producto y todo su historial de precios?")) {
      return;
    }
    setPending(true);
    const fd = new FormData();
    fd.set("id", productId);
    const r = await deleteProduct(fd);
    setPending(false);
    if (!r.ok) {
      alert(r.message);
      return;
    }
    router.push("/products");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="text-sm text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
    >
      Eliminar producto
    </button>
  );
}
