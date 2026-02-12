import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import nodemailer from "nodemailer";
import type { CartItem } from "@/lib/types";

/** GET /api/orders — lista todas las órdenes */
export async function GET() {
  const db = await getDb();
  const docs = await db
    .collection("orders")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  const orders = docs.map((d) => ({
    _id: d._id.toString(),
    customer: d.customer,
    items: d.items,
    paymentMethod: d.paymentMethod,
    total: d.total,
    status: d.status,
    createdAt: d.createdAt,
  }));

  return NextResponse.json(orders);
}

/** POST /api/orders — crea orden, guarda en MongoDB y envía email */
export async function POST(req: Request) {
  const body = await req.json();
  const { customer, items, paymentMethod, total } = body;

  if (!customer?.name || !customer?.phone || !items?.length) {
    return NextResponse.json(
      { error: "Datos incompletos" },
      { status: 400 }
    );
  }

  /* ---- Guardar en MongoDB ---- */
  const db = await getDb();
  const order = {
    customer,
    items,
    paymentMethod,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const result = await db.collection("orders").insertOne(order);

  /* ---- Enviar email al admin ---- */
  await sendOrderEmail({
    orderId: result.insertedId.toString(),
    customer,
    items,
    paymentMethod,
    total,
  });

  return NextResponse.json(
    { id: result.insertedId.toString() },
    { status: 201 }
  );
}

/* ---- Helper: envío de email ---- */
interface EmailData {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    neighborhood: string;
  };
  items: CartItem[];
  paymentMethod: string;
  total: number;
}

async function sendOrderEmail(data: EmailData) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!host || !user || !pass || !adminEmail) {
    console.warn(
      "⚠ SMTP no configurado — email no enviado. " +
        "Agrega SMTP_HOST, SMTP_USER, SMTP_PASS y " +
        "ADMIN_EMAIL en .env.local"
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user, pass },
  });

  const itemRows = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">$${(i.price * i.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join("");

  const payLabel =
    data.paymentMethod === "cash" ? "Efectivo" : "Transferencia";

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#b45309">Nueva Solicitud de Compra</h2>
      <p><strong>Pedido:</strong> ${data.orderId}</p>
      <hr/>
      <h3>Datos del cliente</h3>
      <p>
        <strong>Nombre:</strong> ${data.customer.name}<br/>
        <strong>Celular:</strong> ${data.customer.phone}<br/>
        <strong>Dirección:</strong> ${data.customer.address}<br/>
        <strong>Barrio:</strong> ${data.customer.neighborhood}
      </p>
      <h3>Productos</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#fef3c7">
            <th style="padding:6px 12px;text-align:left">Producto</th>
            <th style="padding:6px 12px;text-align:center">Cant.</th>
            <th style="padding:6px 12px;text-align:right">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p style="font-size:18px;margin-top:12px">
        <strong>Total: $${data.total.toLocaleString()}</strong>
      </p>
      <p><strong>Medio de pago:</strong> ${payLabel}</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"MBC Marketplace" <${user}>`,
    to: adminEmail,
    subject: `Nuevo pedido de ${data.customer.name}`,
    html,
  });
}
