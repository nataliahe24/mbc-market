"use client";

import Link from "next/link";
import { ShoppingCart, LogIn, Cookie } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { useState } from "react";

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-red-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-red-800 font-bold text-xl"
          >
            <Cookie className="h-6 w-6 text-red-600" />
            Mi Buñuelo Cúcuta
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="relative rounded-full border border-red-200 bg-red-50 p-2 text-red-700 hover:bg-red-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
