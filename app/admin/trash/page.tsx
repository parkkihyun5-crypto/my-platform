"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TrashInquiryItem = {
  id: string;
  trashId?: string;
  trashRow: string;
  deletedAt: string;
  originalRow: string;
  createdAt: string;
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  sourcePage: string;
  serviceType: string;
  status: string;
  manager: string;
  priority: string;
  memo: string;
};

const statusLabel: Record<string, string> = {
  new: "신규",
  consulting: "상담중",
  proposal: "견적발송",
  contract: "계약완료",
};

const priorityLabel: Record<string, string> = {
  none: "미지정",
  low: "낮음",
  normal: "보통",
  high: "높음",
  urgent: "긴급",
};

function formatDate(value: string): string {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ko-KR");
}

function displayStatus(status: string): string {
  return statusLabel[status] || status || "신규";
}

function displayPriority(priority: string): string {
  return priorityLabel[priority] || priority || "미지정";
}

function getTrashIdentity(item: TrashInquiryItem): {
  trashId: string;
  trashRow: string;
} {
  return {
    trashId: item.trashId || item.id || "",
    trashRow: item.trashRow || "",
  };
}

export default function AdminTrashPage() {
  const [items, setItems] = useState<TrashInquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [workingId, setWorkingId] = useState<string | null>(null);

  async function loadTrash(showLoading = false) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setErrorMessage("");

      const response = await fetch(`/api/trash-inquiries?t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as {
        ok?: boolean;
        items?: TrashInquiryItem[];
        message?: string;
        detail?: string;
      };

      if (!response.ok || data.ok === false) {
        setItems([]);
        setErrorMessage(
          data.detail
            ? `${data.message || "휴지통 목록을 불러오지 못했습니다."}\n\n${data.detail}`
            : data.message || "휴지통 목록을 불러오지 못했습니다."
        );
        return;
      }

      setItems(data.items || []);
    } catch (error) {
      setItems([]);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "휴지통 목록 조회 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  async function restoreInquiry(item: TrashInquiryItem) {
    const confirmed = window.confirm(
      `[복원 확인]\n\n${
        item.organization || item.name || "선택한 문의"
      }\n\n이 문의를 원본 문의목록으로 복원하시겠습니까?`
    );

    if (!confirmed) return;

    const { trashId, trashRow } = getTrashIdentity(item);

    if (!trashId && !trashRow) {
      alert("복원할 휴지통 문의 ID를 찾을 수 없습니다.");
      return;
    }

    try {
      setWorkingId(item.id);

      const response = await fetch("/api/restore-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trashId,
          trashRow,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        detail?: string;
      };

      if (!response.ok || data.ok === false) {
        alert(
          data.detail
            ? `${data.message || "문의 복원에 실패했습니다."}\n\n${data.detail}`
            : data.message || "문의 복원에 실패했습니다."
        );
        return;
      }

      await loadTrash(true);
      alert(data.message || "문의가 복원되었습니다.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "문의 복원 중 오류가 발생했습니다."
      );
    } finally {
      setWorkingId(null);
    }
  }

  async function permanentDeleteInquiry(item: TrashInquiryItem) {
    const confirmed = window.confirm(
      `[영구 삭제 확인]\n\n${
        item.organization || item.name || "선택한 문의"
      }\n\n이 문의를 휴지통에서도 영구 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );

    if (!confirmed) return;

    const { trashId, trashRow } = getTrashIdentity(item);

    if (!trashId && !trashRow) {
      alert("영구 삭제할 휴지통 문의 ID를 찾을 수 없습니다.");
      return;
    }

    try {
      setWorkingId(item.id);

      const response = await fetch("/api/permanent-delete-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trashId,
          trashRow,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        detail?: string;
      };

      if (!response.ok || data.ok === false) {
        alert(
          data.detail
            ? `${data.message || "영구 삭제에 실패했습니다."}\n\n${data.detail}`
            : data.message || "영구 삭제에 실패했습니다."
        );
        return;
      }

      await loadTrash(true);
      alert(data.message || "문의가 영구 삭제되었습니다.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "문의 영구 삭제 중 오류가 발생했습니다."
      );
    } finally {
      setWorkingId(null);
    }
  }

  useEffect(() => {
    void loadTrash(true);

    const intervalId = window.setInterval(() => {
      void loadTrash(false);
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return items;

    return items.filter((item) =>
      [
        item.trashId,
        item.trashRow,
        item.organization,
        item.name,
        item.phone,
        item.email,
        item.message,
        item.sourcePage,
        item.serviceType,
        item.status,
        item.manager,
        item.priority,
        item.memo,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, keyword]);

  return (
    <main className="min-h-screen bg-[#F6F3EE] px-6 py-10 text-slate-900 md:px-10">
      <div className="mx-auto max-w-[1700px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
              Admin Trash
            </div>

            <h1 className="mt-3 text-4xl font-bold text-[#0B1F35] md:text-5xl">
              휴지통 관리
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              Google Sheet 휴지통 시트에 보관된 문의를 확인하고, 복원 또는
              영구 삭제할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              문의 목록으로 돌아가기
            </Link>

            <button
              type="button"
              onClick={() => void loadTrash(true)}
              className="inline-flex items-center justify-center rounded-full border border-[#0B1F35] bg-[#0B1F35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163556]"
            >
              새로고침
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">
              휴지통 문의
            </div>
            <div className="mt-3 text-4xl font-bold text-[#0B1F35]">
              {items.length}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">
              검색 결과
            </div>
            <div className="mt-3 text-4xl font-bold text-violet-700">
              {filteredItems.length}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">
              관리 상태
            </div>
            <div className="mt-3 text-lg font-bold text-emerald-700">
              {loading ? "조회 중" : "조회 완료"}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <h2 className="text-lg font-bold text-[#0B1F35]">휴지통 목록</h2>

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="기관명, 이름, 연락처, 이메일, 문의내용 검색"
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B1F35] xl:w-[520px]"
            />
          </div>

          {errorMessage ? (
            <div className="mt-5 whitespace-pre-wrap rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[1500px] border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-4 py-2 font-semibold">삭제일시</th>
                  <th className="px-4 py-2 font-semibold">접수일시</th>
                  <th className="px-4 py-2 font-semibold">기관명</th>
                  <th className="px-4 py-2 font-semibold">담당자명</th>
                  <th className="px-4 py-2 font-semibold">연락처</th>
                  <th className="px-4 py-2 font-semibold">이메일</th>
                  <th className="px-4 py-2 font-semibold">서비스유형</th>
                  <th className="px-4 py-2 font-semibold">상태</th>
                  <th className="px-4 py-2 font-semibold">우선순위</th>
                  <th className="px-4 py-2 font-semibold">복원</th>
                  <th className="px-4 py-2 font-semibold">영구삭제</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="rounded-2xl border border-slate-200 bg-[#FCFBF8] px-5 py-10 text-center text-sm font-semibold text-slate-500"
                    >
                      휴지통 목록을 불러오는 중입니다.
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="rounded-2xl border border-slate-200 bg-[#FCFBF8] px-5 py-10 text-center text-sm font-semibold text-slate-500"
                    >
                      휴지통에 보관된 문의가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.trashId || item.id} className="text-sm text-slate-700">
                      <td className="rounded-l-2xl border-y border-l border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {formatDate(item.deletedAt)}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4 font-bold text-[#0B1F35]">
                        {item.organization || "-"}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {item.name || "-"}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {item.phone || "-"}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {item.email || "-"}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {item.serviceType || "-"}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {displayStatus(item.status)}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {displayPriority(item.priority)}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <button
                          type="button"
                          disabled={workingId === item.id}
                          onClick={() => void restoreInquiry(item)}
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {workingId === item.id ? "처리 중..." : "복원"}
                        </button>
                      </td>
                      <td className="rounded-r-2xl border-y border-r border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <button
                          type="button"
                          disabled={workingId === item.id}
                          onClick={() => void permanentDeleteInquiry(item)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {workingId === item.id ? "처리 중..." : "영구 삭제"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
