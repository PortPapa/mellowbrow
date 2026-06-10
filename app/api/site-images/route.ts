import { NextResponse } from "next/server";
import { getSiteImageMap } from "@/lib/site-images-server";

export async function GET() {
  const images = await getSiteImageMap();
  return NextResponse.json({ images });
}
