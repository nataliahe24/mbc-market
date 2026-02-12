"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const {
    items,
    removeFromCart,
    updateQty,
    clearCart,
    total,
  } = useCart();

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSuccess(false);

    const fd = new FormData(e.currentTarget);
    const body = {
      customer: {
        name: fd.get("name") as string,
        phone: fd.get("phone") as string,
        address: fd.get("address") as string,
        neighborhood: fd.get("neighborhood") as string,
      },
      items,
      paymentMethod: fd.get("paymentMethod") as string,
      total,
      consentGiven: true,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error al enviar pedido");
      setSuccess(true);
      clearCart();
    } catch {
      alert("No se pudo enviar el pedido. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="drawer-overlay absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside className="drawer-panel relative flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-bold text-stone-900">
            Tu Carrito
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <SuccessView onClose={onClose} />
        ) : items.length === 0 ? (
          <EmptyView />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-hidden"
          >
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 rounded-lg border p-2"
                >
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover h-16 w-16"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-red-700 font-semibold">
                      ${item.price.toLocaleString()}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        className="rounded border p-0.5 hover:bg-stone-100"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        className="rounded border p-0.5 hover:bg-stone-100"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.productId)
                    }
                    className="self-start p-1 text-stone-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Checkout form */}
            <div className="border-t p-4 space-y-3 bg-stone-50">
              <Input
                name="name"
                label="Nombre completo"
                placeholder="Ana Pérez"
                required
              />
              <Input
                name="phone"
                label="Celular"
                placeholder="3001234567"
                required
              />
              <Input
                name="address"
                label="Dirección"
                placeholder="Calle 123 # 45-67"
                required
              />
              <Input
                name="neighborhood"
                label="Barrio"
                placeholder="El Poblado"
                required
              />

              <fieldset className="space-y-1">
                <legend className="text-sm font-medium text-stone-700">
                  Medio de pago
                </legend>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    defaultChecked
                    className="accent-red-600"
                  />
                  Efectivo
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    className="accent-red-600"
                  />
                  Transferencia
                </label>
              </fieldset>

              {/* Consentimiento de datos */}
              <label className="flex items-start gap-2 text-xs text-stone-600 pt-2 border-t">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="accent-red-600 mt-0.5"
                />
                <span>
                  Autorizo el tratamiento de mis datos personales
                  para gestionar mi pedido, realizar la entrega y
                  contactarme según la{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-red-600 underline"
                  >
                    política de privacidad
                  </a>
                  .
                </span>
              </label>

              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span className="text-red-700">
                  ${total.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar pedido"
                )}
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}

/* ---------- Small helpers ---------- */

function Input({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
      />
    </div>
  );
}

function EmptyView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-stone-400">
      <ShoppingCart className="h-16 w-16" />
      <p className="font-semibold text-lg">Carrito vacío</p>
      <p className="text-sm">Agrega productos para comenzar</p>
    </div>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="rounded-full bg-green-100 p-4">
        <ShoppingCart className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-stone-900">
        ¡Pedido enviado!
      </h3>
      <p className="text-stone-500">
        Hemos recibido tu solicitud. Pronto nos pondremos en
        contacto contigo.
      </p>
      <button
        onClick={onClose}
        className="mt-2 rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700"
      >
        Cerrar
      </button>
    </div>
  );
}
