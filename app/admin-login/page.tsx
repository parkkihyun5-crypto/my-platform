"use client";

import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!password.trim()) {
      setErrorMessage("관리자 암호를 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "관리자 인증에 실패했습니다.");
        return;
      }

      window.location.href = next;
    } catch {
      setErrorMessage("로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F3EE] px-6 py-10 text-slate-900">
      <section className="w-full max-w-[460px] rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
            Admin Access
          </div>

          <h1 className="mt-4 text-3xl font-bold text-[#0B1F35]">
            관리자 로그인
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            문의 관리 대시보드는 관리자 암호 입력 후 접근할 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">
              관리자 암호
            </span>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 암호를 입력하세요"
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base outline-none transition focus:border-[#0B1F35]"
              autoFocus
            />
          </label>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-full bg-[#0B1F35] px-6 py-4 text-base font-bold text-white transition hover:bg-[#163556] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "확인 중..." : "관리자 대시보드 접속"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F6F3EE] px-6 py-10 text-slate-900">
          <section className="w-full max-w-[460px] rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
              Admin Access
            </div>

            <h1 className="mt-4 text-3xl font-bold text-[#0B1F35]">
              관리자 로그인
            </h1>

            <p className="mt-4 text-sm text-slate-500">
              로그인 화면을 불러오는 중입니다.
            </p>
          </section>
        </main>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}