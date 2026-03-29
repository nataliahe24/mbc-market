import crypto from "crypto";
import { NextResponse, type NextRequest } from "next/server";

const FALLBACK_AUTH_SECRET = "default-secret";

function getSessionSecret() {
  return process.env.AUTH_SECRET ?? FALLBACK_AUTH_SECRET;
}

function isValidSignature(rawToken: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", getSessionSecret())
    .update(rawToken)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function hasValidAdminSession(req: NextRequest) {
  const signed = req.cookies.get("admin_session")?.value;

  if (!signed) {
    return false;
  }

  const [rawToken, signature] = signed.split(".");

  if (!rawToken || !signature) {
    return false;
  }

  return isValidSignature(rawToken, signature);
}

export function requireAdminSession(req: NextRequest) {
  if (hasValidAdminSession(req)) {
    return null;
  }

  return NextResponse.json(
    { error: "No autorizado" },
    { status: 401 },
  );
}
