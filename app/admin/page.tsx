"use client";

import type { ReactNode } from "react";
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
  manager?: string;
  priority?: string;
  memo?: string;
};

const statusOptions = ["new", "consulting", "proposal", "contract"];

const statusLabel: Record<string, string> = {
  new: "신규",
  consulting: "상담중",
  proposal: "견적발송",
  contract: "계약완료",
};

const priorityOptions = ["none", "low", "normal", "high", "urgent"];

const priorityLabel: Record<string, string> = {
  none: "미지정",
  low: "낮음",
  normal: "보통",
  high: "높음",
  urgent: "긴급",
};

const managerOptions = ["", "박기현", "관리자", "상담담당", "브랜딩담당"];

function createGmailUrl({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    to
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function createGeneralEmailUrl(item: InquiryItem) {
  const email = item.email?.trim();

  if (!email) return "#";

  const subject = `[NPOLAP 상담 안내] ${
    item.organization || item.name || "문의"
  } 관련 안내드립니다.`;

  const body = [
    `${item.name || "고객"}님, 안녕하세요.`,
    "",
    "NPOLAP 문의를 남겨주셔서 감사합니다.",
    "",
    `문의 서비스: ${item.serviceType || "-"}`,
    `기관명: ${item.organization || "-"}`,
    "",
    "남겨주신 내용을 검토한 뒤 상담 일정을 안내드리겠습니다.",
    "",
    "감사합니다.",
    "",
    "International Leaders Union",
    "NPOLAP 상담팀",
  ].join("\n");

  return createGmailUrl({
    to: email,
    subject,
    body,
  });
}

function createProposalEmailUrl(item: InquiryItem) {
  const email = item.email?.trim();

  if (!email) return "#";

  const subject = `[NPOLAP 견적 안내] ${
    item.organization || item.name || "문의"
  } 관련 견적 안내드립니다.`;

  const body = [
    `${item.name || "고객"}님, 안녕하세요.`,
    "",
    "NPOLAP 문의를 남겨주셔서 감사합니다.",
    "",
    "남겨주신 내용을 기준으로 아래와 같이 상담 및 견적 방향을 안내드립니다.",
    "",
    "────────────────────",
    "■ 문의 정보",
    `기관명: ${item.organization || "-"}`,
    `담당자명: ${item.name || "-"}`,
    `연락처: ${item.phone || "-"}`,
    `이메일: ${item.email || "-"}`,
    `서비스유형: ${item.serviceType || "-"}`,
    "",
    "■ 견적 안내",
    "1. 기본 진단 및 상담",
    "2. 구조 설계 방향 정리",
    "3. 실행 범위 및 일정 협의",
    "4. 세부 견적서 별도 제공",
    "",
    "※ 정확한 견적은 상담 범위, 자료 검토, 실행 난이도에 따라 조정될 수 있습니다.",
    "────────────────────",
    "",
    "검토 후 회신 주시면 다음 단계 상담 일정을 조율드리겠습니다.",
    "",
    "감사합니다.",
    "",
    "International Leaders Union",
    "NPOLAP 상담팀",
  ].join("\n");

  return createGmailUrl({
    to: email,
    subject,
    body,
  });
}

export default function AdminPage() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InquiryItem | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingFieldId, setSavingFieldId] = useState<string | null>(null);
  const [detailMemo, setDetailMemo] = useState("");

  async function loadInquiries(showLoading = false) {
    try {
      if (showLoading) setLoading(true);
      setErrorMessage("");

      const res = await fetch(`/api/inquiry?t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

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

        function openProposalEmailFromList(
    item: InquiryItem,
    preparedWindow?: Window | null
  ): void {
    if (!item.email?.trim()) {
      if (preparedWindow && !preparedWindow.closed) {
        preparedWindow.close();
      }

      alert("\uC774\uBA54\uC77C \uC8FC\uC18C\uAC00 \uC5C6\uB294 \uBB38\uC758\uC785\uB2C8\uB2E4.");
      return;
    }

    const proposalUrl = createProposalEmailUrl(item);

    if (!proposalUrl || proposalUrl === "#") {
      if (preparedWindow && !preparedWindow.closed) {
        preparedWindow.close();
      }

      alert("\uACAC\uC801 \uBA54\uC77C \uC791\uC131\uCC3D\uC744 \uB9CC\uB4E4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return;
    }

    if (preparedWindow && !preparedWindow.closed) {
      preparedWindow.location.href = proposalUrl;

      try {
        preparedWindow.focus();
      } catch {
        // Ignore browser focus restrictions.
      }

      alert("\uACAC\uC801 \uBA54\uC77C \uC791\uC131\uCC3D\uC744 \uC5F4\uC5C8\uC2B5\uB2C8\uB2E4. \uB0B4\uC6A9\uC744 \uD655\uC778\uD55C \uB4A4 \uBCF4\uB0B4\uAE30\uB97C \uB20C\uB7EC\uC8FC\uC138\uC694.");
      return;
    }

    const proposalWindow = window.open(
      proposalUrl,
      "proposalGmailCompose",
      "width=820,height=760,left=120,top=80"
    );

    if (proposalWindow) {
      try {
        proposalWindow.opener = null;
        proposalWindow.focus();
      } catch {
        // Ignore browser security restrictions.
      }

      alert("\uACAC\uC801 \uBA54\uC77C \uC791\uC131\uCC3D\uC744 \uC5F4\uC5C8\uC2B5\uB2C8\uB2E4. \uB0B4\uC6A9\uC744 \uD655\uC778\uD55C \uB4A4 \uBCF4\uB0B4\uAE30\uB97C \uB20C\uB7EC\uC8FC\uC138\uC694.");
      return;
    }

    window.location.href = proposalUrl;
    alert("\uACAC\uC801 \uBA54\uC77C \uC791\uC131 \uD654\uBA74\uC73C\uB85C \uC5F0\uACB0\uD588\uC2B5\uB2C8\uB2E4. \uBA54\uC77C \uC571\uC5D0\uC11C \uB0B4\uC6A9\uC744 \uD655\uC778\uD55C \uB4A4 \uBCF4\uB0B4\uAE30\uB97C \uB20C\uB7EC\uC8FC\uC138\uC694.");
  }

  async function updateStatus(row: string, status: string) {
    const currentItem =
      items.find((item) => item.id === row) ??
      (selectedItem?.id === row ? selectedItem : null);

    let preparedProposalWindow: Window | null = null;

    if (status === "proposal" && currentItem?.email?.trim()) {
      preparedProposalWindow = window.open(
        "about:blank",
        "proposalGmailCompose",
        "width=820,height=760,left=120,top=80"
      );

      if (preparedProposalWindow) {
        try {
          preparedProposalWindow.document.write(
            "<!doctype html><html><head><title>\uACAC\uC801 \uBA54\uC77C \uC900\uBE44 \uC911</title></head><body style='font-family:sans-serif;padding:24px;line-height:1.7;'><h3>\uACAC\uC801 \uBA54\uC77C \uC791\uC131\uCC3D\uC744 \uC900\uBE44\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.</h3><p>\uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824 \uC8FC\uC138\uC694.</p></body></html>"
          );
          preparedProposalWindow.document.close();
          preparedProposalWindow.opener = null;
          preparedProposalWindow.focus();
        } catch {
          // Ignore browser restrictions.
        }
      }
    }

    try {
      setSavingFieldId(row);

      const res = await fetch("/api/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ row, status }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (preparedProposalWindow && !preparedProposalWindow.closed) {
          preparedProposalWindow.close();
        }

        alert(data.message || "\uC0C1\uD0DC \uBCC0\uACBD\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
        return;
      }

      const updatedItem = currentItem
        ? {
            ...currentItem,
            status,
          }
        : null;

      setItems((prev) =>
        prev.map((item) => (item.id === row ? { ...item, status } : item))
      );

      if (selectedItem?.id === row) {
        setSelectedItem({
          ...selectedItem,
          status,
        });
      }

      if (status === "proposal" && updatedItem) {
        openProposalEmailFromList(updatedItem, preparedProposalWindow);
      }
    } catch {
      if (preparedProposalWindow && !preparedProposalWindow.closed) {
        preparedProposalWindow.close();
      }

      alert("\uC0C1\uD0DC \uBCC0\uACBD \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
    } finally {
      setSavingFieldId(null);
    }
  }
async function updateAdminFields(
    row: string,
    fields: {
      manager?: string;
      priority?: string;
      memo?: string;
    }
  ) {
    try {
      setSavingFieldId(row);

      const res = await fetch("/api/update-admin-fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          row,
          ...fields,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.message || "관리자 정보 저장에 실패했습니다.");
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === row
            ? {
                ...item,
                ...fields,
              }
            : item
        )
      );

      if (selectedItem?.id === row) {
        const updated = {
          ...selectedItem,
          ...fields,
        };

        setSelectedItem(updated);
        setDetailMemo(updated.memo || "");
      }
    } catch (error) {
      console.error(error);
      alert("관리자 정보 저장 중 오류가 발생했습니다.");
    } finally {
      setSavingFieldId(null);
    }
  }

  async function moveToTrash(row: string) {
    const target = items.find((item) => item.id === row);

    const label = target
      ? `${target.organization || "-"} / ${target.name || "-"}`
      : "선택한 문의";

    const ok = window.confirm(
      `[휴지통 이동 확인]\n\n${label}\n\n이 문의를 휴지통으로 이동하시겠습니까?\nGoogle Sheet의 원본 문의목록에서는 제거되고, 휴지통 시트와 삭제로그 시트에 기록됩니다.`
    );

    if (!ok) return;

    try {
      setDeletingId(row);

      const res = await fetch("/api/delete-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          row,
          deletedBy: "admin",
          deleteReason: "관리자 대시보드에서 휴지통 이동",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.message || "문의 휴지통 이동에 실패했습니다.");
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== row));

      if (selectedItem?.id === row) {
        setSelectedItem(null);
      }

      await loadInquiries(false);
    } catch (error) {
      console.error(error);
      alert("문의 휴지통 이동 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleProposalClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    item: InquiryItem
  ) {
    if (!item.email?.trim()) {
      event.preventDefault();
      alert("이메일 주소가 없는 문의입니다.");
      return;
    }

    window.setTimeout(async () => {
      const changeStatus = window.confirm(
        "견적발송 메일 작성창을 열었습니다.\n이 문의 상태를 '견적발송'으로 변경하시겠습니까?"
      );

      if (changeStatus) {
        await updateStatus(item.id, "proposal");
      }
    }, 500);
  }

  function handleGeneralEmailClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    item: InquiryItem
  ) {
    if (!item.email?.trim()) {
      event.preventDefault();
      alert("이메일 주소가 없는 문의입니다.");
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin-logout", {
        method: "POST",
        cache: "no-store",
      });
    } finally {
      window.location.href = "/admin-login";
    }
  }

  function downloadExcelCsv() {
    const headers = [
      "접수일시",
      "기관명",
      "담당자명",
      "연락처",
      "이메일",
      "문의내용",
      "유입페이지",
      "서비스유형",
      "상태",
      "담당자",
      "우선순위",
      "관리자메모",
    ];

    const rows = filteredItems.map((item) => [
      formatDate(item.createdAt),
      item.organization || "",
      item.name || "",
      item.phone || "",
      item.email || "",
      item.message || "",
      item.sourcePage || "",
      item.serviceType || "",
      statusLabel[item.status] || item.status || "신규",
      item.manager || "",
      priorityLabel[item.priority || "none"] || item.priority || "",
      item.memo || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const value = String(cell ?? "").replace(/"/g, '""');
            return `"${value}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `NPOLAP_문의목록_${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  useEffect(() => {
    if (selectedItem) {
      setDetailMemo(selectedItem.memo || "");
    }
  }, [selectedItem]);

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return items.filter((item) => {
      const matchesKeyword = !q
        ? true
        : [
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
            .includes(q);

      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      const itemPriority = item.priority || "none";

      const matchesPriority =
        priorityFilter === "all" ? true : itemPriority === priorityFilter;

      return matchesKeyword && matchesStatus && matchesPriority;
    });
  }, [items, keyword, statusFilter, priorityFilter]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      newCount: items.filter((item) => item.status === "new").length,
      consultingCount: items.filter((item) => item.status === "consulting")
        .length,
      proposalCount: items.filter((item) => item.status === "proposal").length,
      contractCount: items.filter((item) => item.status === "contract").length,
    };
  }, [items]);

  return (
    <main className="min-h-screen bg-[#F6F3EE] px-6 py-10 text-slate-900 md:px-10">
      <div className="mx-auto max-w-[1700px]">
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

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadExcelCsv}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100"
            >
              엑셀 다운로드
            </button>

            <button
              type="button"
              onClick={() => void loadInquiries(true)}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#0B1F35] shadow-sm transition hover:shadow-md"
            >
              새로고침
            </button>

            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100"
            >
              로그아웃
            </button>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <SummaryCard title="전체 문의" value={summary.total} />
          <SummaryCard title="신규" value={summary.newCount} tone="amber" />
          <SummaryCard
            title="상담중"
            value={summary.consultingCount}
            tone="blue"
          />
          <SummaryCard
            title="견적발송"
            value={summary.proposalCount}
            tone="violet"
          />
          <SummaryCard
            title="계약완료"
            value={summary.contractCount}
            tone="emerald"
          />
        </div>

        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <h2 className="text-lg font-bold text-[#0B1F35]">문의 목록</h2>

            <div className="grid gap-3 md:grid-cols-[1fr_180px_180px] xl:w-[900px]">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="기관명, 이름, 연락처, 이메일, 문의내용 검색"
                className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B1F35]"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#0B1F35]"
              >
                <option value="all">전체 상태</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel[status]}
                  </option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#0B1F35]"
              >
                <option value="all">전체 우선순위</option>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priorityLabel[priority]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[1550px] border-separate border-spacing-y-3">
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
                  <th className="px-4 py-2 font-semibold">담당자</th>
                  <th className="px-4 py-2 font-semibold">우선순위</th>
                  <th className="px-4 py-2 font-semibold">상세</th>
                  <th className="px-4 py-2 font-semibold">휴지통</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] px-4 py-10 text-center text-sm text-slate-500"
                    >
                      불러오는 중입니다.
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
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
                          disabled={savingFieldId === item.id}
                          onChange={(e) =>
                            void updateStatus(item.id, e.target.value)
                          }
                          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabel[status]}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.manager || ""}
                          disabled={savingFieldId === item.id}
                          onChange={(e) =>
                            void updateAdminFields(item.id, {
                              manager: e.target.value,
                            })
                          }
                          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
                        >
                          <option value="">미지정</option>
                          {managerOptions
                            .filter(Boolean)
                            .map((manager) => (
                              <option key={manager} value={manager}>
                                {manager}
                              </option>
                            ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.priority || "none"}
                          disabled={savingFieldId === item.id}
                          onChange={(e) =>
                            void updateAdminFields(item.id, {
                              priority: e.target.value,
                            })
                          }
                          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
                        >
                          {priorityOptions.map((priority) => (
                            <option key={priority} value={priority}>
                              {priorityLabel[priority]}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          상세보기
                        </button>
                      </TableCell>
                      <TableCell last>
                        <button
                          type="button"
                          disabled={deletingId === item.id}
                          onClick={() => void moveToTrash(item.id)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === item.id ? "이동 중..." : "휴지통"}
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
          <div className="max-h-[90vh] w-full max-w-[920px] overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
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
                value={
                  statusLabel[selectedItem.status] ||
                  selectedItem.status ||
                  "신규"
                }
              />

              <div className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
                <div className="text-sm font-semibold text-slate-500">
                  담당자 배정
                </div>

                <select
                  value={selectedItem.manager || ""}
                  onChange={(e) =>
                    void updateAdminFields(selectedItem.id, {
                      manager: e.target.value,
                    })
                  }
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <option value="">미지정</option>
                  {managerOptions.filter(Boolean).map((manager) => (
                    <option key={manager} value={manager}>
                      {manager}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
                <div className="text-sm font-semibold text-slate-500">
                  우선순위
                </div>

                <select
                  value={selectedItem.priority || "none"}
                  onChange={(e) =>
                    void updateAdminFields(selectedItem.id, {
                      priority: e.target.value,
                    })
                  }
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priorityLabel[priority]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 md:col-span-2">
                <div className="text-sm font-semibold text-slate-500">
                  문의 내용
                </div>

                <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-8 text-slate-700 md:text-base">
                  {selectedItem.message || "-"}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 md:col-span-2">
                <div className="text-sm font-semibold text-slate-500">
                  관리자 메모
                </div>

                <textarea
                  value={detailMemo}
                  onChange={(e) => setDetailMemo(e.target.value)}
                  placeholder="상담 진행 내용, 후속 조치, 특이사항 등을 기록하세요."
                  className="mt-3 min-h-[130px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-[#0B1F35]"
                />

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      void updateAdminFields(selectedItem.id, {
                        memo: detailMemo,
                      })
                    }
                    className="rounded-full border border-[#0B1F35] bg-[#0B1F35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#163556]"
                  >
                    메모 저장
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 md:col-span-2">
                <div className="text-sm font-semibold text-slate-500">
                  상태 변경
                </div>

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

              <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
                <a
                  href={createGeneralEmailUrl(selectedItem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) =>
                    handleGeneralEmailClick(event, selectedItem)
                  }
                  className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  고객에게 이메일 보내기
                </a>

                <a
                  href={createProposalEmailUrl(selectedItem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) =>
                    void handleProposalClick(event, selectedItem)
                  }
                  className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                >
                  견적발송 메일 보내기
                </a>

                <button
                  type="button"
                  disabled={deletingId === selectedItem.id}
                  onClick={() => void moveToTrash(selectedItem.id)}
                  className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === selectedItem.id
                    ? "휴지통 이동 중..."
                    : "이 문의 휴지통 이동"}
                </button>
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

      <div className={`mt-3 text-3xl font-bold ${colorMap[tone]}`}>
        {value}
      </div>
    </div>
  );
}

function TableCell({
  children,
  first,
  last,
  strong,
}: {
  children: ReactNode;
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
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
    >
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


