"use client";

import { useEffect, useMemo, useState } from "react";
import {
  INQUIRY_STATUS_CLASS,
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_ORDER,
  type InquiryItem,
  type InquiryStatus,
} from "@/lib/inquiry-types";

type StatusFilter = InquiryStatus | "all";

export default function AdminPage() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  async function loadInquiries(): Promise<void> {
    try {
      setLoading(true);
      const response = await fetch("/api/inquiry", { cache: "no-store" });
      const data = (await response.json()) as { items?: InquiryItem[] };
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(
    id: string,
    status: InquiryStatus
  ): Promise<void> {
    const response = await fetch("/api/inquiry", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) {
      alert("상태 변경 중 오류가 발생했습니다.");
      return;
    }

    await loadInquiries();
  }

  useEffect(() => {
    void loadInquiries();
  }, []);

  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((item) => item.status === statusFilter);
  }, [items, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      newCount: items.filter((item) => item.status === "new").length,
      consultingCount: items.filter((item) => item.status === "consulting").length,
      proposalCount: items.filter((item) => item.status === "proposal").length,
      negotiationCount: items.filter((item) => item.status === "negotiation").length,
      contractCount: items.filter((item) => item.status === "contract").length,
    };
  }, [items]);

  return (
    <main className="min-h-screen bg-[#F6F3EE] px-6 py-10 text-slate-900 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
              Admin Dashboard
            </div>
            <h1 className="mt-3 text-3xl font-bold text-[#0B1F35] md:text-4xl">
              관리자 대시보드
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              void loadInquiries();
            }}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#0B1F35] shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:shadow-md"
          >
            새로고침
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">전체 문의</div>
            <div className="mt-3 text-3xl font-bold text-[#0B1F35]">
              {summary.total}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">신규</div>
            <div className="mt-3 text-3xl font-bold text-amber-600">
              {summary.newCount}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">상담</div>
            <div className="mt-3 text-3xl font-bold text-blue-600">
              {summary.consultingCount}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">제안</div>
            <div className="mt-3 text-3xl font-bold text-violet-600">
              {summary.proposalCount}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">협의</div>
            <div className="mt-3 text-3xl font-bold text-orange-600">
              {summary.negotiationCount}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">계약</div>
            <div className="mt-3 text-3xl font-bold text-emerald-600">
              {summary.contractCount}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-lg font-bold text-[#0B1F35]">문의 목록</div>

            <div className="flex flex-wrap gap-2">
              {(["all", ...INQUIRY_STATUS_ORDER] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatusFilter(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    statusFilter === item
                      ? "border-[#0B1F35] bg-[#0B1F35] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item === "all" ? "전체" : INQUIRY_STATUS_LABEL[item]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-4 py-2 font-semibold">접수일시</th>
                  <th className="px-4 py-2 font-semibold">기관명</th>
                  <th className="px-4 py-2 font-semibold">성명</th>
                  <th className="px-4 py-2 font-semibold">연락처</th>
                  <th className="px-4 py-2 font-semibold">이메일</th>
                  <th className="px-4 py-2 font-semibold">문의 내용</th>
                  <th className="px-4 py-2 font-semibold">상태</th>
                  <th className="px-4 py-2 font-semibold">변경</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] px-4 py-8 text-center text-sm text-slate-500"
                    >
                      불러오는 중입니다.
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] px-4 py-8 text-center text-sm text-slate-500"
                    >
                      표시할 문의가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="overflow-hidden rounded-[24px] border border-slate-200 bg-[#FCFBF8] align-top"
                    >
                      <td className="rounded-l-[24px] px-4 py-4 text-sm text-slate-700">
                        {new Date(item.createdAt).toLocaleString("ko-KR")}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-[#0B1F35]">
                        {item.organization || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {item.name || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {item.phone || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {item.email || "-"}
                      </td>
                      <td className="max-w-[380px] px-4 py-4 text-sm leading-7 text-slate-700">
                        <div className="whitespace-pre-wrap break-words">
                          {item.message || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 font-semibold ${INQUIRY_STATUS_CLASS[item.status]}`}
                        >
                          {INQUIRY_STATUS_LABEL[item.status]}
                        </span>
                      </td>
                      <td className="rounded-r-[24px] px-4 py-4">
                        <div className="flex flex-col gap-2">
                          {INQUIRY_STATUS_ORDER.map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => {
                                void handleStatusChange(item.id, status);
                              }}
                              className={`rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-300 hover:opacity-80 ${INQUIRY_STATUS_CLASS[status]}`}
                            >
                              {INQUIRY_STATUS_LABEL[status]}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}