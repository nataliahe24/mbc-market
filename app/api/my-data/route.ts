import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

/** GET /api/my-data?phone=3001234567 — consulta datos por celular */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json(
      { error: "Número de celular requerido" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const orders = await db
    .collection("orders")
    .find({ "customer.phone": phone })
    .sort({ createdAt: -1 })
    .toArray();

  const data = orders.map((o) => ({
    id: o._id.toString(),
    customer: o.customer,
    total: o.total,
    items: o.items,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt,
  }));

  return NextResponse.json({ orders: data, count: data.length });
}

/** DELETE /api/my-data?phone=3001234567 — elimina todos los datos */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json(
      { error: "Número de celular requerido" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const result = await db
    .collection("orders")
    .deleteMany({ "customer.phone": phone });

  return NextResponse.json({
    deleted: result.deletedCount,
    message:
      result.deletedCount > 0
        ? "Todos tus datos han sido eliminados"
        : "No se encontraron datos con ese número",
  });
}
