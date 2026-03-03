"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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

type OrderStatus = "pending" | "done";

type AdminOrder = {
  _id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    neighborhood?: string;
  };
  paymentMethod?: string;
  total: number;
  status?: OrderStatus;
  createdAt: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders"
  >("dashboard");
  const [showAllOrders, setShowAllOrders] =
    useState(false);

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

  async function handleStatusChange(
    id: string,
    status: OrderStatus,
  ) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      console.error("No se pudo actualizar estado");
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o._id === id ? { ...o, status } : o,
      ),
    );
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-login");
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Top bar */}
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white text-sm font-semibold">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-stone-900">
                MBC Marketplace
              </span>
              <span className="text-[11px] text-stone-400">
                Panel interno
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-4 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("dashboard");
                  scrollToSection("admin-dashboard");
                }}
                className={
                  activeTab === "dashboard"
                    ? "rounded-full bg-red-50 px-3 py-1 text-red-600"
                    : "rounded-full px-3 py-1 text-stone-500 hover:text-stone-800"
                }
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("products");
                  scrollToSection("admin-products");
                }}
                className={
                  activeTab === "products"
                    ? "rounded-full bg-red-50 px-3 py-1 text-red-600"
                    : "rounded-full px-3 py-1 text-stone-500 hover:text-stone-800"
                }
              >
                Productos
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("orders");
                  scrollToSection("admin-orders");
                }}
                className={
                  activeTab === "orders"
                    ? "rounded-full bg-red-50 px-3 py-1 text-red-600"
                    : "rounded-full px-3 py-1 text-stone-500 hover:text-stone-800"
                }
              >
                Pedidos
              </button>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Portal clientes
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Header + stats */}
        <section
          id="admin-dashboard"
          className="space-y-6"
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-stone-900">
              Panel de Administración
            </h1>
            <p className="text-sm text-stone-500">
              Resumen detallado de ventas y operaciones del
              marketplace.
            </p>
          </div>
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
        </section>

        {/* Products section */}
        <section id="admin-products" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] leading-[32px] font-bold text-[#0f172a]">
              Gestión de Productos
            </h2>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar producto
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
          <section id="admin-orders">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[24px] leading-[32px] font-bold text-[#0f172a]">
                Pedidos recientes
              </h2>
              {orders.length > 10 && !showAllOrders && (
                <button
                  type="button"
                  onClick={() => setShowAllOrders(true)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Ver todo el historial →
                </button>
              )}
            </div>
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
                    <th className="px-4 py-3 hidden xl:table-cell">
                      Barrio
                    </th>
                    <th className="px-4 py-3 hidden sm:table-cell">
                      Medio de pago
                    </th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3 hidden sm:table-cell">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(showAllOrders
                    ? orders
                    : orders.slice(0, 10)
                  ).map((o) => (
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
                      <td className="px-4 py-2 hidden xl:table-cell text-stone-600">
                        {o.customer?.neighborhood ?? "—"}
                      </td>
                      <td className="px-4 py-2 hidden sm:table-cell text-stone-600">
                        {o.paymentMethod === "cash"
                          ? "Efectivo"
                          : o.paymentMethod === "transfer"
                          ? "Transferencia"
                          : "—"}
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge
                          value={o.status ?? "pending"}
                          onChange={(value) =>
                            handleStatusChange(o._id, value)
                          }
                        />
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
    <div className="flex items-center gap-4 rounded-2xl border border-stone-100 bg-white px-5 py-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="text-xs text-stone-500">{label}</p>
        <p className="text-xl font-bold text-stone-900 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ---------- Status badge ---------- */
function StatusBadge({
  value,
  onChange,
}: {
  value: OrderStatus;
  onChange: (value: OrderStatus) => void;
}) {
  const isDone = value === "done";
  const base =
    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium";
  const cls = isDone
    ? `${base} bg-emerald-50 text-emerald-700`
    : `${base} bg-red-50 text-red-700`;

  const next: OrderStatus = isDone ? "pending" : "done";

  return (
    <button
      type="button"
      onClick={() => onChange(next)}
      className={cls}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current"
        aria-hidden="true"
      />
      {isDone ? "Finalizado" : "Pendiente"}
    </button>
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
