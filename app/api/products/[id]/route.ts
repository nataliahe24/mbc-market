import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

interface Ctx {
  params: Promise<{ id: string }>;
}

/** GET /api/products/:id — obtiene un producto */
export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const db = await getDb();
  const doc = await db
    .collection("products")
    .findOne({ _id: new ObjectId(id) });

  if (!doc) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    price: doc.price,
    image: doc.image,
  });
}

/** PUT /api/products/:id — actualiza un producto */
export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { name, description, price, image } = body;

  const db = await getDb();
  const result = await db
    .collection("products")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description, price: Number(price), image } }
    );

  if (result.matchedCount === 0) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}

/** DELETE /api/products/:id — elimina un producto */
export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const db = await getDb();
  await db
    .collection("products")
    .deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ ok: true });
}
