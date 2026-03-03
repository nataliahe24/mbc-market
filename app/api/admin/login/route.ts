import { NextResponse } from "next/server";
import crypto from "crypto";

interface LoginBody {
  username?: string;
  password?: string;
  remember?: boolean;
}

export async function POST(req: Request) {
  const body = (await req.json()) as LoginBody;
  const username = body.username ?? "";
  const password = body.password ?? "";

  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: "Auth no configurada" },
      { status: 500 },
    );
  }

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 },
    );
  }

  const secret = process.env.AUTH_SECRET ?? "default-secret";
  const rawToken = crypto.randomUUID();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(rawToken)
    .digest("hex");
  const signed = `${rawToken}.${signature}`;

  const eightHours = 60 * 60 * 8;
  const thirtyDays = 60 * 60 * 24 * 30;
  const maxAge = body.remember ? thirtyDays : eightHours;

  const res = NextResponse.json({ ok: true });

  res.cookies.set("admin_session", signed, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  return res;
}
