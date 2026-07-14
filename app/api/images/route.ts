import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "image");
    if (!fs.existsSync(dir)) return NextResponse.json([]);

    const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
    const urls = files.map((f) => `/image/${encodeURIComponent(f)}`);
    return NextResponse.json(urls);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}
