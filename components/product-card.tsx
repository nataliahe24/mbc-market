"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart-provider";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-stone-900 leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-stone-500 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-red-700">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
