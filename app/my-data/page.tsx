"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import {
  Search,
  Trash2,
  ShieldCheck,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface OrderData {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    neighborhood: string;
  };
  total: number;
  paymentMethod: string;
  createdAt: string;
}

export default function MyDataPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<OrderData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setOrders(null);
    setDeleted(false);

    const res = await fetch(
      `/api/my-data?phone=${encodeURIComponent(phone)}`
    );
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await fetch(
      `/api/my-data?phone=${encodeURIComponent(phone)}`,
      { method: "DELETE" }
    );
    setOrders(null);
    setDeleted(true);
    setConfirmDelete(false);
    setLoading(false);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-stone-900">
            Mis Datos Personales
          </h1>
        </div>

        <p className="text-sm text-stone-600 mb-6">
          Consulta, verifica o solicita la eliminación de tus
          datos personales almacenados. Ingresa el número de
          celular que usaste al hacer tu pedido.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 mb-6"
        >
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Tu número de celular"
            required
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Consultar
          </button>
        </form>

        {/* Deleted message */}
        {deleted && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm text-green-800 mb-6">
            <ShieldCheck className="h-6 w-6 mx-auto mb-2" />
            <p className="font-semibold">
              Datos eliminados exitosamente
            </p>
            <p className="mt-1 text-green-600">
              Toda tu información personal ha sido removida
              de nuestra base de datos.
            </p>
          </div>
        )}

        {/* Results */}
        {orders !== null && !deleted && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center text-stone-400 py-8">
                No se encontraron datos con ese número.
              </p>
            ) : (
              <>
                <p className="text-sm text-stone-600">
                  Se encontraron{" "}
                  <strong>{orders.length}</strong> pedido(s)
                  asociados a tu número.
                </p>

                {/* Data summary */}
                <div className="rounded-xl border bg-white p-4 space-y-3">
                  <h3 className="font-semibold text-stone-900">
                    Datos almacenados
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-stone-500">
                        Nombre:
                      </span>{" "}
                      <span className="font-medium">
                        {orders[0].customer.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500">
                        Celular:
                      </span>{" "}
                      <span className="font-medium">
                        {orders[0].customer.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500">
                        Dirección:
                      </span>{" "}
                      <span className="font-medium">
                        {orders[0].customer.address}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500">
                        Barrio:
                      </span>{" "}
                      <span className="font-medium">
                        {orders[0].customer.neighborhood}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Orders list */}
                <div className="rounded-xl border bg-white overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-stone-50 text-left text-stone-500">
                      <tr>
                        <th className="px-4 py-2">Fecha</th>
                        <th className="px-4 py-2">Total</th>
                        <th className="px-4 py-2">Pago</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td className="px-4 py-2 text-stone-600">
                            {new Date(
                              o.createdAt
                            ).toLocaleDateString("es-CO")}
                          </td>
                          <td className="px-4 py-2 font-semibold text-red-700">
                            ${o.total.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-stone-600">
                            {o.paymentMethod === "cash"
                              ? "Efectivo"
                              : "Transferencia"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Delete section */}
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-100 w-full justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                    Solicitar eliminación de mis datos
                  </button>
                ) : (
                  <div className="rounded-xl border border-red-300 bg-red-50 p-4 space-y-3">
                    <div className="flex items-start gap-2 text-red-800">
                      <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">
                          ¿Estás seguro?
                        </p>
                        <p className="text-sm mt-1">
                          Se eliminarán permanentemente todos
                          tus pedidos y datos personales. Esta
                          acción no se puede deshacer.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Sí, eliminar todo
                      </button>
                      <button
                        onClick={() =>
                          setConfirmDelete(false)
                        }
                        className="flex-1 rounded-lg border py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t flex justify-between text-sm">
          <Link
            href="/privacy"
            className="text-red-600 hover:underline"
          >
            Política de privacidad
          </Link>
          <Link
            href="/"
            className="text-stone-500 hover:text-stone-800 underline"
          >
            &larr; Volver al catálogo
          </Link>
        </div>
      </main>
    </>
  );
}
