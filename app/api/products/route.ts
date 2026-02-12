import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

/** GET /api/products — lista todos los productos */
export async function GET() {
  const db = await getDb();
  const docs = await db
    .collection("products")
    .find()
    .sort({ name: 1 })
    .toArray();

  const products = docs.map((d) => ({
    id: d._id.toString(),
    name: d.name,
    description: d.description,
    price: d.price,
    image: d.image,
  }));

  return NextResponse.json(products);
}

/** POST /api/products — crea un producto */
export async function POST(req: Request) {
  const body = await req.json();
  const { name, description, price, image } = body;

  if (!name || !description || price == null || !image) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const result = await db.collection("products").insertOne({
    name,
    description,
    price: Number(price),
    image,
  });

  return NextResponse.json(
    { id: result.insertedId.toString() },
    { status: 201 }
  );
}
