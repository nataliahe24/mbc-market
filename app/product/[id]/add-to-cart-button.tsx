"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/types";
import { useState } from "react";

export function AddToCartButton({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-red-600 py-3 px-6 text-lg font-semibold text-white hover:bg-red-700 transition-colors"
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          ¡Agregado!
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          Agregar al carrito
        </>
      )}
    </button>
  );
}
