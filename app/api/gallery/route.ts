import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const items = await getDb().listGallery();
    return NextResponse.json({ items });
  } catch (e) {
    console.error("[gallery:list]", e);
    return NextResponse.json({ error: "갤러리를 불러오지 못했어요." }, { status: 500 });
  }
}
