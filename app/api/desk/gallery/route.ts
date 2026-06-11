import { NextRequest, NextResponse } from "next/server";
import { getDb, type FilePayload } from "@/lib/db";
import { GALLERY_CATEGORIES } from "@/lib/constants";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

async function toPayload(file: File): Promise<FilePayload> {
  return { fileName: file.name, contentType: file.type, data: await file.arrayBuffer() };
}

function validateImage(file: unknown, label: string): string | null {
  if (!(file instanceof File)) return `${label} 이미지를 선택해 주세요.`;
  if (!file.type.startsWith("image/")) return "이미지 파일만 올릴 수 있어요.";
  if (file.size > MAX_SIZE) return "8MB 이하 이미지만 올릴 수 있어요.";
  return null;
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  const before = form.get("before") ?? form.get("file"); // 'file'은 구버전 호환
  const after = form.get("after");
  const category = String(form.get("category") ?? "기타");

  const beforeErr = validateImage(before, "비포");
  if (beforeErr) return NextResponse.json({ error: beforeErr }, { status: 400 });
  if (after !== null && after !== "") {
    const afterErr = validateImage(after, "애프터");
    if (afterErr) return NextResponse.json({ error: afterErr }, { status: 400 });
  }
  if (!(GALLERY_CATEGORIES as readonly string[]).includes(category)) {
    return NextResponse.json({ error: "올바른 분류가 아니에요." }, { status: 400 });
  }

  try {
    const item = await getDb().addGalleryImage({
      category,
      before: await toPayload(before as File),
      after: after instanceof File ? await toPayload(after) : undefined,
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    console.error("[desk:gallery:add]", e);
    return NextResponse.json({ error: "업로드에 실패했어요." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }
  try {
    const ok = await getDb().deleteGalleryImage(id);
    if (!ok) return NextResponse.json({ error: "사진을 찾을 수 없어요." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[desk:gallery:delete]", e);
    return NextResponse.json({ error: "삭제에 실패했어요." }, { status: 500 });
  }
}
