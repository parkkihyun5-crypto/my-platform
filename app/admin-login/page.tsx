"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function getNextPath(): string {
    if (typeof window === "undefined") return "/admin";

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");

    if (!next) return "/admin";
    if (!next.startsWith("/")) return "/admin";
    if (next.startsWith("/admin-login")) return "/admin";

    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!password.trim()) {
      setMessage("관리자 암호를 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          password,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        setMessage(result.message || "관리자 인증에 실패했습니다.");
        return;
      }

      setPassword("");
      router.replace(getNextPath());
      router.refresh();
    } catch {
      setMessage("로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F3EE] px-6 py-10 text-slate-900 md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[520px] items-center justify-center">
        <section className="w-full rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.10)] md:p-9">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
            Admin Login
          </div>

          <h1 className="mt-3 text-3xl font-bold text-[#0B1F35] md:text-4xl">
            관리자 로그인
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            관리자 대시보드 접근을 위해 암호를 입력해 주세요.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="text-sm font-semibold text-slate-700"
              >
                관리자 암호
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="관리자 암호 입력"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0B1F35] focus:ring-4 focus:ring-[#0B1F35]/10"
              />
            </div>

            {message ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#0B1F35] bg-[#0B1F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#163556] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "확인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#FCFBF8] px-4 py-4 text-xs leading-6 text-slate-500">
            관리자 인증 쿠키는 브라우저에 httpOnly 방식으로 저장되며, 일정 시간이 지나면 다시 로그인해야 합니다.
          </div>
        </section>
      </div>
    </main>
  );
}