import { notFound } from "next/navigation";
import Image from "next/image";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Header } from "@/components/header";
import { AddToCartButton } from "./add-to-cart-button";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const db = await getDb();
    const doc = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!doc) return null;

    return {
      id: doc._id.toString(),
      name: doc.name as string,
      description: doc.description as string,
      price: doc.price as number,
      image: doc.image as string,
    };
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-3 text-stone-600 leading-relaxed">
              {product.description}
            </p>
            <p className="mt-4 text-3xl font-bold text-red-700">
              ${product.price.toLocaleString()}
            </p>

            <AddToCartButton product={product} />

            <a
              href="/"
              className="mt-3 text-sm text-stone-500 hover:text-stone-800 underline"
            >
              &larr; Volver al catálogo
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
