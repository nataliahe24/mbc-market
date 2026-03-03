import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type OrderStatus = "pending" | "done";

interface PatchBody {
  status?: OrderStatus;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Id inválido" },
      { status: 400 },
    );
  }

  const body = (await req.json()) as PatchBody;

  if (body.status !== "pending" && body.status !== "done") {
    return NextResponse.json(
      { error: "Estado inválido" },
      { status: 400 },
    );
  }

  const db = await getDb();

  await db.collection("orders").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: body.status } },
  );

  return NextResponse.json({ ok: true });
}

