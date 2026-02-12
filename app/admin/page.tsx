"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Cookie,
  ShoppingCart,
  Users,
  ArrowLeft,
} from "lucide-react";
import type { Product } from "@/lib/types";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [orders, setOrders] = useState<
    { _id: string; customer: { name: string; phone: string; address: string }; total: number; createdAt: string }[]
  >([]);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function fetchOrders() {
    const res = await fetch("/api/orders");
    if (res.ok) setOrders(await res.json());
  }

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  function openCreate() {
    setEditing(null);
    setModal(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setModal(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Cookie className="h-6 w-6 text-red-600" />
            <span className="font-bold text-lg text-stone-900">
              Admin
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Cookie className="h-5 w-5" />}
            label="Productos"
            value={products.length}
          />
          <StatCard
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Pedidos"
            value={orders.length}
          />
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Ingresos"
            value={`$${orders
              .reduce((s, o) => s + (o.total ?? 0), 0)
              .toLocaleString()}`}
          />
        </div>

        {/* Products section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-stone-900">
              Productos
            </h2>
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          </div>

          {loading ? (
            <p className="text-stone-400 py-10 text-center">
              Cargando...
            </p>
          ) : products.length === 0 ? (
            <p className="text-stone-400 py-10 text-center">
              No hay productos aún. ¡Crea el primero!
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-white">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-left text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Imagen</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3 hidden sm:table-cell">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50">
                      <td className="px-4 py-2">
                        <Image
                          src={p.image || "/placeholder.png"}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="rounded-md object-cover h-12 w-12"
                        />
                      </td>
                      <td className="px-4 py-2 font-medium text-stone-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-2 hidden sm:table-cell text-red-700 font-semibold">
                        ${p.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(p)}
                            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent orders */}
        {orders.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-4">
              Pedidos recientes
            </h2>
            <div className="overflow-x-auto rounded-xl border bg-white">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-left text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3 hidden md:table-cell">
                      Celular
                    </th>
                    <th className="px-4 py-3 hidden lg:table-cell">
                      Dirección
                    </th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3 hidden sm:table-cell">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.slice(0, 10).map((o) => (
                    <tr key={o._id}>
                      <td className="px-4 py-2 font-medium">
                        {o.customer?.name ?? "—"}
                      </td>
                      <td className="px-4 py-2 hidden md:table-cell text-stone-600">
                        {o.customer?.phone ?? "—"}
                      </td>
                      <td className="px-4 py-2 hidden lg:table-cell text-stone-600">
                        {o.customer?.address ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-red-700 font-semibold">
                        ${(o.total ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 hidden sm:table-cell text-stone-400">
                        {o.createdAt
                          ? new Date(
                              o.createdAt
                            ).toLocaleDateString("es-CO")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {modal && (
        <ProductModal
          product={editing}
          onClose={() => setModal(false)}
          onSaved={() => {
            setModal(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

/* ---------- Stat card ---------- */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-white p-4">
      <div className="rounded-lg bg-red-50 p-2 text-red-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-stone-500">{label}</p>
        <p className="text-xl font-bold text-stone-900">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ---------- Product modal ---------- */
function ProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const isEdit = product !== null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      description: fd.get("description"),
      price: Number(fd.get("price")),
      image: fd.get("image"),
    };

    const url = isEdit
      ? `/api/products/${product.id}`
      : "/api/products";

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (res.ok) onSaved();
    else alert("Error al guardar el producto");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            name="name"
            label="Nombre"
            defaultValue={product?.name}
            required
          />
          <Field
            name="description"
            label="Descripción"
            defaultValue={product?.description}
            textarea
            required
          />
          <Field
            name="price"
            label="Precio"
            type="number"
            defaultValue={product?.price?.toString()}
            required
          />
          <Field
            name="image"
            label="URL de imagen"
            defaultValue={product?.image}
            placeholder="https://..."
            required
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-red-600 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Form field ---------- */
function Field({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  required,
  textarea,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const cls =
    "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none";

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          rows={3}
          className={cls}
        />
      ) : (
        <input
          name={name}
          type={type}
          step={type === "number" ? "100" : undefined}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className={cls}
        />
      )}
    </div>
  );
}
