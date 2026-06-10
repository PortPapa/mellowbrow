"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { DESK_PATH } from "@/lib/constants";

export default function DeskLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api${DESK_PATH}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace(DESK_PATH);
        router.refresh();
      } else {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "로그인에 실패했어요.");
      }
    } catch {
      setError("네트워크 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--gutter)",
      }}
    >
      <Card elevation="md" style={{ width: 380, maxWidth: "100%", padding: "40px 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <Logo variant="stacked" size={26} />
          <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-secondary)" }}>
            예약 관리 데스크
          </p>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            label="비밀번호"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error || undefined}
            autoFocus
          />
          <Button full size="lg" type="submit" disabled={!password || loading}>
            {loading ? "확인 중…" : "들어가기"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
