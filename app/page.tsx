import { getDb } from "@/lib/mongodb";
import type { Product } from "@/lib/types";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

async function getProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection("products")
      .find()
      .sort({ name: 1 })
      .toArray();

    return docs.map((d) => ({
      id: d._id.toString(),
      name: d.name as string,
      description: d.description as string,
      price: d.price as number,
      image: d.image as string,
    }));
  } catch (err) {
    console.error("Error al conectar con MongoDB:", err);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="text-center mb-10">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            Nuestros Deliciosos Buñuelos
          </h1>
          <p className="mt-2 text-stone-500 max-w-lg mx-auto">
            Recién hechos todos los días. Descubre nuestra
            variedad de buñuelos tradicionales y gourmet.
          </p>
        </section>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg font-medium">
              No hay productos disponibles aún.
            </p>
            <p className="text-sm mt-1">
              El administrador puede agregarlos desde{" "}
              <a
                href="/admin"
                className="text-red-600 underline"
              >
                el panel de admin
              </a>
              .
            </p>
          </div>
        )}
      </main>

      <footer className="border-t py-6 text-center text-xs text-stone-400">
        &copy; 2025 MBC Marketplace. Todos los derechos
        reservados.
      </footer>
    </>
  );
}
