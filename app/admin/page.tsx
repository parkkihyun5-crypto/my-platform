"use client";

import type { MouseEvent, ReactNode } from "react";
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

type LeadTypeFilter = "all" | "legalEntityChecklist";

const LEGAL_ENTITY_CHECKLIST_MARKER = "[법인별 제출서류 체크리스트 결과]";

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

function isLegalEntityChecklistInquiry(item: InquiryItem): boolean {
  return item.message.includes(LEGAL_ENTITY_CHECKLIST_MARKER);
}

function extractLineValue(message: string, label: string): string {
  if (!message) return "";

  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = message.match(new RegExp(`${escapedLabel}\\s*:\\s*(.+)`));

  return match?.[1]?.trim() ?? "";
}

function extractInquiryBody(message: string): string {
  if (!message) return "";

  const marker = "문의 내용:";
  const markerIndex = message.indexOf(marker);

  if (markerIndex < 0) return message.trim();

  return message.slice(markerIndex + marker.length).trim();
}

function getConsultingType(item: InquiryItem): string {
  return (
    extractLineValue(item.message, "상담 유형") ||
    item.serviceType ||
    item.organization ||
    ""
  );
}

function getCurrentStage(item: InquiryItem): string {
  return extractLineValue(item.message, "현재 단계");
}

function getConsultingMethod(item: InquiryItem): string {
  return extractLineValue(item.message, "희망 상담 방식");
}

function getDisplayMessage(item: InquiryItem): string {
  return extractInquiryBody(item.message);
}

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

  const consultingType = getConsultingType(item);

  const subject = `[NPOLAP 상담 안내] ${
    consultingType || item.name || "문의"
  } 관련 안내드립니다.`;

  const body = [
    `${item.name || "고객"}님, 안녕하세요.`,
    "",
    "NPOLAP 문의를 남겨주셔서 감사합니다.",
    "",
    `상담 유형: ${consultingType || "-"}`,
    `현재 단계: ${getCurrentStage(item) || "-"}`,
    `희망 상담 방식: ${getConsultingMethod(item) || "-"}`,
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

  const consultingType = getConsultingType(item);

  const subject = `[NPOLAP 견적 안내] ${
    consultingType || item.name || "문의"
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
    `상담 유형: ${consultingType || "-"}`,
    `성함: ${item.name || "-"}`,
    `연락처: ${item.phone || "-"}`,
    `이메일: ${item.email || "-"}`,
    `현재 단계: ${getCurrentStage(item) || "-"}`,
    `희망 상담 방식: ${getConsultingMethod(item) || "-"}`,
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

function formatDate(value: string): string {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ko-KR");
}

export default function AdminPage() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [leadTypeFilter, setLeadTypeFilter] =
    useState<LeadTypeFilter>("all");
  const [selectedItem, setSelectedItem] = useState<InquiryItem | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [savingFieldId, setSavingFieldId] = useState<string | null>(null);
  const [detailMemo, setDetailMemo] = useState("");
  const [expandedCell, setExpandedCell] = useState<string | null>(null);

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

      alert("이메일 주소가 없는 문의입니다.");
      return;
    }

    const proposalUrl = createProposalEmailUrl(item);

    if (!proposalUrl || proposalUrl === "#") {
      if (preparedWindow && !preparedWindow.closed) {
        preparedWindow.close();
      }

      alert("견적 메일 작성창을 만들 수 없습니다.");
      return;
    }

    if (preparedWindow && !preparedWindow.closed) {
      preparedWindow.location.href = proposalUrl;

      try {
        preparedWindow.focus();
      } catch {
        // Ignore browser focus restrictions.
      }

      alert(
        "견적 메일 작성창을 열었습니다. 내용을 확인한 뒤 보내기를 눌러주세요."
      );
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

      alert(
        "견적 메일 작성창을 열었습니다. 내용을 확인한 뒤 보내기를 눌러주세요."
      );
      return;
    }

    window.location.href = proposalUrl;
    alert(
      "견적 메일 작성 화면으로 연결했습니다. 메일 앱에서 내용을 확인한 뒤 보내기를 눌러주세요."
    );
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
            "<!doctype html><html><head><title>견적 메일 준비 중</title></head><body style='font-family:sans-serif;padding:24px;line-height:1.7;'><h3>견적 메일 작성창을 준비하고 있습니다.</h3><p>잠시만 기다려 주세요.</p></body></html>"
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

        alert(data.message || "상태 변경에 실패했습니다.");
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

      alert("상태 변경 중 오류가 발생했습니다.");
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

  async function moveToTrash(row: string, options?: { skipConfirm?: boolean }) {
    const target = items.find((item) => item.id === row);

    const label = target
      ? `${getConsultingType(target) || "-"} / ${target.name || "-"}`
      : "선택한 문의";

    const ok =
      options?.skipConfirm ||
      window.confirm(
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
      setSelectedIds((prev) => prev.filter((id) => id !== row));

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

  async function moveSelectedToTrash() {
    const rows = selectedIds.filter((id) =>
      filteredItems.some((item) => item.id === id)
    );

    if (rows.length === 0) {
      alert("삭제할 문의를 선택해주세요.");
      return;
    }

    const ok = window.confirm(
      `[선택 삭제 확인]\n\n선택한 문의 ${rows.length}건을 휴지통으로 이동하시겠습니까?\nGoogle Sheet의 원본 문의목록에서는 제거되고, 휴지통 시트와 삭제로그 시트에 기록됩니다.`
    );

    if (!ok) return;

    try {
      setBulkDeleting(true);

      for (const row of rows) {
        await moveToTrash(row, { skipConfirm: true });
      }

      setSelectedIds([]);
    } finally {
      setBulkDeleting(false);
    }
  }

  async function handleProposalClick(
    event: MouseEvent<HTMLAnchorElement>,
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
    event: MouseEvent<HTMLAnchorElement>,
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
      "상담유형",
      "성함",
      "연락처",
      "이메일",
      "현재단계",
      "희망상담방식",
      "문의내용",
      "유입페이지",
      "서비스유형",
      "상태",
      "담당자",
      "우선순위",
      "관리자메모",
      "문의분류",
    ];

    const rows = filteredItems.map((item) => [
      formatDate(item.createdAt),
      getConsultingType(item),
      item.name || "",
      item.phone || "",
      item.email || "",
      getCurrentStage(item),
      getConsultingMethod(item),
      getDisplayMessage(item),
      item.sourcePage || "",
      item.serviceType || "",
      statusLabel[item.status] || item.status || "신규",
      item.manager || "",
      priorityLabel[item.priority || "none"] || item.priority || "",
      item.memo || "",
      isLegalEntityChecklistInquiry(item) ? "법인별 제출서류 체크리스트" : "",
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
      const consultingType = getConsultingType(item);
      const currentStage = getCurrentStage(item);
      const consultingMethod = getConsultingMethod(item);
      const displayMessage = getDisplayMessage(item);

      const matchesKeyword = !q
        ? true
        : [
            item.organization,
            item.name,
            item.phone,
            item.email,
            consultingType,
            currentStage,
            consultingMethod,
            displayMessage,
            item.message,
            item.sourcePage,
            item.serviceType,
            item.status,
            item.manager,
            item.priority,
            item.memo,
            isLegalEntityChecklistInquiry(item)
              ? "법인별 제출서류 체크리스트 제출서류 체크리스트"
              : "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(q);

      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      const itemPriority = item.priority || "none";

      const matchesPriority =
        priorityFilter === "all" ? true : itemPriority === priorityFilter;

      const matchesLeadType =
        leadTypeFilter === "all"
          ? true
          : isLegalEntityChecklistInquiry(item);

      return (
        matchesKeyword &&
        matchesStatus &&
        matchesPriority &&
        matchesLeadType
      );
    });
  }, [items, keyword, statusFilter, priorityFilter, leadTypeFilter]);

  const filteredIds = filteredItems.map((item) => item.id);
  const selectedVisibleIds = selectedIds.filter((id) =>
    filteredIds.includes(id)
  );
  const allVisibleSelected =
    filteredIds.length > 0 && selectedVisibleIds.length === filteredIds.length;

  const summary = useMemo(() => {
    return {
      total: items.length,
      newCount: items.filter((item) => item.status === "new").length,
      consultingCount: items.filter((item) => item.status === "consulting")
        .length,
      proposalCount: items.filter((item) => item.status === "proposal").length,
      contractCount: items.filter((item) => item.status === "contract").length,
      legalEntityChecklistCount: items.filter((item) =>
        isLegalEntityChecklistInquiry(item)
      ).length,
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

            <a
              href="/admin/trash"
              className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              휴지통 보기
            </a>

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

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
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

          <button
            type="button"
            onClick={() =>
              setLeadTypeFilter((prev) =>
                prev === "legalEntityChecklist"
                  ? "all"
                  : "legalEntityChecklist"
              )
            }
            className={`rounded-[28px] border p-5 text-left shadow-sm transition hover:-translate-y-[1px] ${
              leadTypeFilter === "legalEntityChecklist"
                ? "border-[#0B1F35] bg-[#0B1F35] text-white"
                : "border-indigo-200 bg-indigo-50 text-indigo-800"
            }`}
          >
            <div className="text-sm font-semibold">제출서류 체크리스트</div>
            <div className="mt-3 text-3xl font-bold">
              {summary.legalEntityChecklistCount}
            </div>
            <div className="mt-2 text-xs font-medium">
              법인별 제출서류 결과 포함 문의
            </div>
          </button>
        </div>

        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold text-[#0B1F35]">문의 목록</h2>

              <button
                type="button"
                disabled={selectedVisibleIds.length === 0 || bulkDeleting}
                onClick={() => void moveSelectedToTrash()}
                className="rounded border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bulkDeleting
                  ? "삭제 중..."
                  : `선택 삭제 (${selectedVisibleIds.length})`}
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_170px_170px_210px] xl:w-[1120px]">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="상담 유형, 성함, 연락처, 이메일, 현재 단계, 문의내용 검색"
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

              <select
                value={leadTypeFilter}
                onChange={(e) =>
                  setLeadTypeFilter(e.target.value as LeadTypeFilter)
                }
                className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#0B1F35]"
              >
                <option value="all">전체 문의유형</option>
                <option value="legalEntityChecklist">
                  제출서류 체크리스트
                </option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1680px] table-fixed border-collapse bg-white text-xs">
              <colgroup>
                <col className="w-[42px]" />
                <col className="w-[130px]" />
                <col className="w-[150px]" />
                <col className="w-[95px]" />
                <col className="w-[115px]" />
                <col className="w-[165px]" />
                <col className="w-[125px]" />
                <col className="w-[130px]" />
                <col className="w-[210px]" />
                <col className="w-[80px]" />
                <col className="w-[105px]" />
                <col className="w-[105px]" />
                <col className="w-[100px]" />
                <col className="w-[100px]" />
              </colgroup>
              <thead>
                <tr className="bg-slate-100 text-left text-xs text-slate-600">
                  <th className="border border-slate-300 px-2 py-1 font-semibold">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={(event) =>
                        setSelectedIds((prev) =>
                          event.target.checked
                            ? Array.from(new Set([...prev, ...filteredIds]))
                            : prev.filter((id) => !filteredIds.includes(id))
                        )
                      }
                      aria-label="현재 목록 전체 선택"
                      className="h-4 w-4 rounded border-slate-400"
                    />
                  </th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">접수일시</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">상담 유형</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">성함</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">연락처</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">이메일</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">현재 단계</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">상담 방식</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">문의 내용</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">상태</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">상태변경</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">담당자</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">우선순위</th>
                  <th className="border border-slate-300 px-2 py-1 font-semibold">상세</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={14}
                      className="border border-slate-300 bg-[#FCFBF8] px-4 py-10 text-center text-sm text-slate-500"
                    >
                      불러오는 중입니다.
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={14}
                      className="border border-slate-300 bg-[#FCFBF8] px-4 py-10 text-center text-sm text-slate-500"
                    >
                      표시할 문의가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="align-middle">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          disabled={bulkDeleting || deletingId === item.id}
                          onChange={(event) =>
                            setSelectedIds((prev) =>
                              event.target.checked
                                ? Array.from(new Set([...prev, item.id]))
                                : prev.filter((id) => id !== item.id)
                            )
                          }
                          aria-label={`${item.name || "문의"} 선택`}
                          className="h-4 w-4 rounded border-slate-400"
                        />
                      </TableCell>

                      <TableCell>
                        <ExpandableCell
                          id={`inquiry-${item.id}-createdAt`}
                          value={formatDate(item.createdAt)}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </TableCell>

                      <TableCell strong>
                        <div className="flex items-center gap-2">
                          <ExpandableCell
                            id={`inquiry-${item.id}-type`}
                            value={getConsultingType(item) || "-"}
                            expandedCell={expandedCell}
                            setExpandedCell={setExpandedCell}
                          />
                          {isLegalEntityChecklistInquiry(item) ? (
                            <span className="shrink-0 rounded-full border border-indigo-200 bg-indigo-100 px-2 py-0.5 text-[11px] font-bold tracking-[0.08em] text-indigo-700">
                              제출서류
                            </span>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell>
                        <ExpandableCell
                          id={`inquiry-${item.id}-name`}
                          value={item.name || "-"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </TableCell>
                      <TableCell>
                        <ExpandableCell
                          id={`inquiry-${item.id}-phone`}
                          value={item.phone || "-"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </TableCell>
                      <TableCell>
                        <ExpandableCell
                          id={`inquiry-${item.id}-email`}
                          value={item.email || "-"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </TableCell>
                      <TableCell>
                        <ExpandableCell
                          id={`inquiry-${item.id}-stage`}
                          value={getCurrentStage(item) || "-"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </TableCell>
                      <TableCell>
                        <ExpandableCell
                          id={`inquiry-${item.id}-method`}
                          value={getConsultingMethod(item) || "-"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </TableCell>
                      <TableCell>
                        <ExpandableCell
                          id={`inquiry-${item.id}-message`}
                          value={getDisplayMessage(item) || "-"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </TableCell>
                      <TableCell>
                        <ExpandableCell
                          id={`inquiry-${item.id}-status`}
                          value={statusLabel[item.status] || item.status || "신규"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.status || "new"}
                          disabled={savingFieldId === item.id}
                          onChange={(e) =>
                            void updateStatus(item.id, e.target.value)
                          }
                          className="w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-xs font-semibold text-slate-700 disabled:opacity-60"
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
                          className="w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-xs font-semibold text-slate-700 disabled:opacity-60"
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
                          className="w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-xs font-semibold text-slate-700 disabled:opacity-60"
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
                          className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
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
          <div className="max-h-[90vh] w-full max-w-[920px] overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
                  Inquiry Detail
                </div>

                <h2 className="mt-3 text-3xl font-bold text-[#0B1F35]">
                  {getConsultingType(selectedItem) || "-"}
                </h2>

                {isLegalEntityChecklistInquiry(selectedItem) ? (
                  <div className="mt-3 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
                    법인별 제출서류 체크리스트 결과 포함 문의
                  </div>
                ) : null}
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
              <DetailCard
                title="상담 유형"
                value={getConsultingType(selectedItem)}
              />
              <DetailCard title="성함" value={selectedItem.name} />
              <DetailCard title="연락처" value={selectedItem.phone} />
              <DetailCard title="이메일" value={selectedItem.email} />
              <DetailCard
                title="현재 단계"
                value={getCurrentStage(selectedItem)}
              />
              <DetailCard
                title="희망 상담 방식"
                value={getConsultingMethod(selectedItem)}
              />
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
                  {getDisplayMessage(selectedItem) || "-"}
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
                  onClick={(event) => void handleProposalClick(event, selectedItem)}
                  className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                >
                  견적발송
                </a>

                <button
                  type="button"
                  onClick={() => void moveToTrash(selectedItem.id)}
                  className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  휴지통 이동
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
  tone?: "slate" | "amber" | "blue" | "violet" | "emerald";
}) {
  const toneClass: Record<string, string> = {
    slate: "border-slate-200 bg-white text-[#0B1F35]",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <div className={`rounded-[28px] border p-5 shadow-sm ${toneClass[tone]}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
    </div>
  );
}

function TableCell({
  children,
  strong = false,
}: {
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <td
      className={`border border-slate-300 bg-white px-2 py-1 text-xs leading-5 text-slate-700 ${
        strong ? "font-bold text-[#0B1F35]" : ""
      }`}
    >
      {children}
    </td>
  );
}

function ExpandableCell({
  id,
  value,
  expandedCell,
  setExpandedCell,
}: {
  id: string;
  value: string;
  expandedCell: string | null;
  setExpandedCell: (value: string | null) => void;
}) {
  const isExpanded = expandedCell === id;

  return (
    <button
      type="button"
      title={value}
      onClick={() => setExpandedCell(isExpanded ? null : id)}
      className={`block w-full px-1 py-0.5 text-left transition ${
        isExpanded
          ? "whitespace-pre-wrap break-words bg-[#FFF7E8] text-[#0B1F35] shadow-sm"
          : "truncate hover:bg-[#FFF7E8]"
      }`}
    >
      {value || "-"}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = statusLabel[status] || status || "신규";

  const className =
    status === "contract"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "proposal"
        ? "border-violet-200 bg-violet-50 text-violet-700"
        : status === "consulting"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${className}`}
    >
      {label}
    </span>
  );
}

function DetailCard({ title, value }: { title: string; value?: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
      <div className="text-sm font-semibold text-slate-500">{title}</div>
      <div className="mt-2 break-words text-lg font-bold text-[#0B1F35]">
        {value || "-"}
      </div>
    </div>
  );
}
