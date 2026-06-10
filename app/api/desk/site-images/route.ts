import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { SITE_IMAGE_KEYS } from "@/lib/site-images";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  const file = form.get("file");
  const key = String(form.get("key") ?? "");

  if (!SITE_IMAGE_KEYS.includes(key)) {
    return NextResponse.json({ error: "올바른 이미지 슬롯이 아니에요." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "이미지 파일을 선택해 주세요." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "이미지 파일만 올릴 수 있어요." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "8MB 이하 이미지만 올릴 수 있어요." }, { status: 400 });
  }

  try {
    const url = await getDb().setSiteImage(key, {
      fileName: file.name,
      contentType: file.type,
      data: await file.arrayBuffer(),
    });
    return NextResponse.json({ key, url }, { status: 201 });
  } catch (e) {
    console.error("[desk:site-images:set]", e);
    return NextResponse.json({ error: "업로드에 실패했어요." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") ?? "";
  if (!SITE_IMAGE_KEYS.includes(key)) {
    return NextResponse.json({ error: "올바른 이미지 슬롯이 아니에요." }, { status: 400 });
  }
  try {
    const ok = await getDb().deleteSiteImage(key);
    if (!ok) return NextResponse.json({ error: "교체된 이미지가 없어요." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[desk:site-images:delete]", e);
    return NextResponse.json({ error: "기본값 복원에 실패했어요." }, { status: 500 });
  }
}
