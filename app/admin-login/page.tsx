"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import Link from "next/link";

type FormState = {
  loading: boolean;
  error: string | null;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [state, setState] = useState<FormState>({
    loading: false,
    error: null,
  });

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const username = data.get("username") as string;
    const password = data.get("password") as string;
    const remember = data.get("remember") === "on";

    setState({ loading: true, error: null });

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, remember }),
    });

    if (!res.ok) {
      setState({
        loading: false,
        error: "Correo o contraseña incorrectos",
      });

      return;
    }

    router.push(next);
  }

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white text-lg font-bold">
              MB
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                Mi Buñuelo Cúcuta
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-md p-6 sm:p-8">
          <header className="mb-6 text-center">
            <h1 className="text-lg sm:text-xl font-bold text-stone-900">
              Acceso Administrador
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-500">
              Ingresa tus credenciales de gestión interna.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {state.error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {state.error}
              </p>
            )}

            <div className="space-y-1 text-sm">
              <label
                htmlFor="username"
                className="font-medium text-stone-700"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-stone-400">
                  @
                </span>
                <input
                  id="username"
                  name="username"
                  type="email"
                  required
                  className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-8 pr-3 text-sm text-stone-900 placeholder-stone-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="nombre@ejemplo.com"
                />
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="font-medium text-stone-700"
                >
                  Contraseña
                </label>
                <span className="text-xs text-red-600">
                  ¿Olvidaste la clave?
                </span>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-stone-400">
                  *
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-8 pr-3 text-sm text-stone-900 placeholder-stone-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-stone-600">
              <input
                type="checkbox"
                name="remember"
                className="h-3.5 w-3.5 rounded border-stone-300 text-red-600 focus:ring-red-500"
              />
              <span> Mantener sesión iniciada</span>
            </label>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {state.loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-6 border-t pt-4 text-center">
            <Link
              href="/"
              className="text-xs text-stone-500 hover:text-stone-800"
            >
              ← Regresar al portal de clientes
            </Link>
          </div>
        </div>

        <p className="mt-4 text-[10px] text-center text-stone-400">
          © 2024 Mi Buñuelo Cúcuta · Sistema de gestión interna
        </p>
      </div>
    </main>
  );
}

