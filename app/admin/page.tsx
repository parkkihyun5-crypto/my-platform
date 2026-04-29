"use client";

import { useEffect, useMemo, useState } from "react";

type InquiryItem = {
  id: string;
  createdAt: string;
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  sourcePage: string;
  serviceType: string;
  status: string;
};

const statusOptions = ["new", "consulting", "proposal", "contract"];

const statusLabel: Record<string, string> = {
  new: "신규",
  consulting: "상담중",
  proposal: "견적발송",
  contract: "계약완료",
};

export default function AdminPage() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedItem, setSelectedItem] = useState<InquiryItem | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadInquiries(showLoading = false) {
    try {
      if (showLoading) setLoading(true);
      setErrorMessage("");

      const res = await fetch(`/api/inquiry?t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      console.log("INQUIRY API RESULT:", data);

      if (!res.ok || data.ok === false) {
        setItems([]);
        setErrorMessage(data.message || "문의 데이터를 불러오지 못했습니다.");
        return;
      }

      setItems(Array.isArray(data.items) ? data.items : []);
      setLastUpdated(new Date().toLocaleTimeString("ko-KR"));
    } catch (error) {
      console.error(error);
      setItems([]);
      setErrorMessage("관리자 데이터 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(row: string, status: string) {
    try {
      const res = await fetch("/api/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ row, status }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.message || "상태 변경에 실패했습니다.");
        return;
      }

      await loadInquiries(false);

      if (selectedItem?.id === row) {
        setSelectedItem({
          ...selectedItem,
          status,
        });
      }
    } catch {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  }

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!alive) return;
      await loadInquiries(true);
    }

    run();

    const timer = setInterval(() => {
      if (alive) {
        void loadInquiries(false);
      }
    }, 5000);

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return items;

    return items.filter((item) =>
      [
        item.organization,
        item.name,
        item.phone,
        item.email,
        item.message,
        item.sourcePage,
        item.serviceType,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, keyword]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      newCount: items.filter((item) => item.status === "new").length,
      consultingCount: items.filter((item) => item.status === "consulting").length,
      proposalCount: items.filter((item) => item.status === "proposal").length,
      contractCount: items.filter((item) => item.status === "contract").length,
    };
  }, [items]);

  return (
    <main className="min-h-screen bg-[#F6F3EE] px-6 py-10 text-slate-900 md:px-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
              Admin CRM
            </div>
            <h1 className="mt-3 text-3xl font-bold text-[#0B1F35] md:text-4xl">
              문의 관리 대시보드
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Google Sheet 문의 데이터를 5초마다 자동 갱신합니다.
              {lastUpdated ? ` 마지막 갱신: ${lastUpdated}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadInquiries(true)}
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#0B1F35] shadow-sm transition hover:shadow-md"
          >
            새로고침
          </button>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <SummaryCard title="전체 문의" value={summary.total} />
          <SummaryCard title="신규" value={summary.newCount} tone="amber" />
          <SummaryCard title="상담중" value={summary.consultingCount} tone="blue" />
          <SummaryCard title="견적발송" value={summary.proposalCount} tone="violet" />
          <SummaryCard title="계약완료" value={summary.contractCount} tone="emerald" />
        </div>

        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-bold text-[#0B1F35]">문의 목록</h2>

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="기관명, 이름, 연락처, 이메일, 문의내용 검색"
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B1F35] md:w-[420px]"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-4 py-2 font-semibold">접수일시</th>
                  <th className="px-4 py-2 font-semibold">기관명</th>
                  <th className="px-4 py-2 font-semibold">담당자명</th>
                  <th className="px-4 py-2 font-semibold">연락처</th>
                  <th className="px-4 py-2 font-semibold">이메일</th>
                  <th className="px-4 py-2 font-semibold">서비스유형</th>
                  <th className="px-4 py-2 font-semibold">상태</th>
                  <th className="px-4 py-2 font-semibold">상태변경</th>
                  <th className="px-4 py-2 font-semibold">상세</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] px-4 py-10 text-center text-sm text-slate-500"
                    >
                      불러오는 중입니다.
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] px-4 py-10 text-center text-sm text-slate-500"
                    >
                      표시할 문의가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="align-top">
                      <TableCell first>{formatDate(item.createdAt)}</TableCell>
                      <TableCell strong>{item.organization || "-"}</TableCell>
                      <TableCell>{item.name || "-"}</TableCell>
                      <TableCell>{item.phone || "-"}</TableCell>
                      <TableCell>{item.email || "-"}</TableCell>
                      <TableCell>{item.serviceType || "-"}</TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.status || "new"}
                          onChange={(e) => void updateStatus(item.id, e.target.value)}
                          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabel[status]}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell last>
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          상세보기
                        </button>
                      </TableCell>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-10">
          <div className="max-h-[90vh] w-full max-w-[820px] overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
                  Inquiry Detail
                </div>
                <h2 className="mt-3 text-3xl font-bold text-[#0B1F35]">
                  {selectedItem.organization || "-"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                닫기
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <DetailCard title="담당자명" value={selectedItem.name} />
              <DetailCard title="연락처" value={selectedItem.phone} />
              <DetailCard title="이메일" value={selectedItem.email} />
              <DetailCard title="유입페이지" value={selectedItem.sourcePage} />
              <DetailCard title="서비스유형" value={selectedItem.serviceType} />
              <DetailCard
                title="상태"
                value={statusLabel[selectedItem.status] || selectedItem.status || "신규"}
              />

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 md:col-span-2">
                <div className="text-sm font-semibold text-slate-500">문의 내용</div>
                <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-8 text-slate-700 md:text-base">
                  {selectedItem.message || "-"}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 md:col-span-2">
                <div className="text-sm font-semibold text-slate-500">상태 변경</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => void updateStatus(selectedItem.id, status)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                        selectedItem.status === status
                          ? "border-[#0B1F35] bg-[#0B1F35] text-white"
                          : "border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      {statusLabel[status]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  title,
  value,
  tone = "slate",
}: {
  title: string;
  value: number;
  tone?: "slate" | "amber" | "blue" | "emerald" | "violet";
}) {
  const colorMap = {
    slate: "text-[#0B1F35]",
    amber: "text-amber-600",
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    violet: "text-violet-600",
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-500">{title}</div>
      <div className={`mt-3 text-3xl font-bold ${colorMap[tone]}`}>{value}</div>
    </div>
  );
}

function TableCell({
  children,
  first,
  last,
  strong,
}: {
  children: React.ReactNode;
  first?: boolean;
  last?: boolean;
  strong?: boolean;
}) {
  return (
    <td
      className={`border-y border-slate-200 bg-[#FCFBF8] px-4 py-4 text-sm text-slate-700 ${
        first ? "rounded-l-[24px] border-l" : ""
      } ${last ? "rounded-r-[24px] border-r" : ""} ${
        strong ? "font-semibold text-[#0B1F35]" : ""
      }`}
    >
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = statusLabel[status] || status || "신규";

  const className =
    status === "contract"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "consulting"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : status === "proposal"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

function DetailCard({ title, value }: { title: string; value?: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
      <div className="text-sm font-semibold text-slate-500">{title}</div>
      <div className="mt-2 break-all text-lg font-bold text-[#0B1F35]">
        {value || "-"}
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "-";
  return date.toLocaleString("ko-KR");
}