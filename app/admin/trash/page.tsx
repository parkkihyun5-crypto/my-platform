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
  nextActionDate?: string;
  quoteAmount?: string;
  dashboardHidden?: string;
  scheduledDeleteAt?: string;
};

type DashboardDeletedTrashRecord = {
  trashKey: string;
  trashId: string;
  trashRow: string;
  deletedAt: string;
  scheduledDeleteAt: string;
  organization: string;
  name: string;
  email: string;
  serviceType: string;
  memo: string;
  syncStatus: "pending" | "synced" | "failed";
  syncMessage: string;
};

const DASHBOARD_TRASH_DELETE_RECORDS_KEY =
  "npolap_admin_trash_delete_records_v1";

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

function getConsultingType(item: TrashInquiryItem): string {
  return (
    extractLineValue(item.message, "상담 유형") ||
    item.serviceType ||
    item.organization ||
    ""
  );
}

function getCurrentStage(item: TrashInquiryItem): string {
  return extractLineValue(item.message, "현재 단계");
}

function getConsultingMethod(item: TrashInquiryItem): string {
  return extractLineValue(item.message, "희망 상담 방식");
}

function getDisplayMessage(item: TrashInquiryItem): string {
  return extractInquiryBody(item.message);
}

function getTrashKey(item: TrashInquiryItem): string {
  return item.trashId || item.id || item.trashRow || "";
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

function getScheduledDeleteDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString();
}

function readDashboardDeletedRecords(): DashboardDeletedTrashRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(DASHBOARD_TRASH_DELETE_RECORDS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item && typeof item.trashKey === "string");
  } catch {
    return [];
  }
}

function writeDashboardDeletedRecords(
  records: DashboardDeletedTrashRecord[]
): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    DASHBOARD_TRASH_DELETE_RECORDS_KEY,
    JSON.stringify(records)
  );
}

function upsertDashboardDeletedRecord(
  record: DashboardDeletedTrashRecord
): DashboardDeletedTrashRecord[] {
  const records = readDashboardDeletedRecords();
  const nextRecords = [
    record,
    ...records.filter((item) => item.trashKey !== record.trashKey),
  ].slice(0, 300);

  writeDashboardDeletedRecords(nextRecords);

  return nextRecords;
}

function updateDashboardDeletedRecord(
  trashKey: string,
  patch: Partial<DashboardDeletedTrashRecord>
): DashboardDeletedTrashRecord[] {
  const records = readDashboardDeletedRecords();

  const nextRecords = records.map((record) =>
    record.trashKey === trashKey
      ? {
          ...record,
          ...patch,
        }
      : record
  );

  writeDashboardDeletedRecords(nextRecords);

  return nextRecords;
}

function removeDashboardDeletedRecord(
  trashKey: string
): DashboardDeletedTrashRecord[] {
  const records = readDashboardDeletedRecords();
  const nextRecords = records.filter((record) => record.trashKey !== trashKey);

  writeDashboardDeletedRecords(nextRecords);

  return nextRecords;
}

export default function AdminTrashPage() {
  const [items, setItems] = useState<TrashInquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [expandedCell, setExpandedCell] = useState<string | null>(null);
  const [dashboardDeletedRecords, setDashboardDeletedRecords] = useState<
    DashboardDeletedTrashRecord[]
  >([]);

  async function loadTrash(showLoading = false) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setErrorMessage("");

      const localRecords = readDashboardDeletedRecords();
      const hiddenKeys = new Set(localRecords.map((record) => record.trashKey));

      setDashboardDeletedRecords(localRecords);

      const response = await fetch(`/api/trash-inquiries?t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as {
        ok?: boolean;
        source?: string;
        sheetName?: string;
        items?: TrashInquiryItem[];
        message?: string;
        detail?: string;
      };

      if (!response.ok || data.ok === false) {
        setItems([]);
        setErrorMessage(
          data.detail
            ? `${
                data.message || "휴지통 목록을 불러오지 못했습니다."
              }\n\n${data.detail}`
            : data.message || "휴지통 목록을 불러오지 못했습니다."
        );
        return;
      }

      const nextItems = (data.items || []).filter((item) => {
        const trashKey = getTrashKey(item);
        return !hiddenKeys.has(trashKey);
      });

      setItems(nextItems);
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

  function refreshDashboardRecords() {
    setDashboardDeletedRecords(readDashboardDeletedRecords());
  }

  async function restoreInquiry(item: TrashInquiryItem) {
    const confirmed = window.confirm(
      `[복원 확인]\n\n${
        getConsultingType(item) || item.name || "선택한 문의"
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
            ? `${data.message || "문의 복원에 실패했습니다."}\n\n${
                data.detail
              }`
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

  function dashboardDeleteInquiry(item: TrashInquiryItem) {
    const confirmed = window.confirm(
      `[대시보드 삭제 확인]\n\n${
        getConsultingType(item) || item.name || "선택한 문의"
      }\n\n이 문의를 대시보드 휴지통 목록에서 삭제하시겠습니까?\n\nGoogle Sheet 휴지통에서는 즉시 삭제하지 않고, 7일 후 정리 대상이 됩니다.`
    );

    if (!confirmed) return;

    const { trashId, trashRow } = getTrashIdentity(item);
    const trashKey = getTrashKey(item);

    if (!trashKey) {
      alert("삭제할 휴지통 문의 ID를 찾을 수 없습니다.");
      return;
    }

    const record: DashboardDeletedTrashRecord = {
      trashKey,
      trashId,
      trashRow,
      deletedAt: new Date().toISOString(),
      scheduledDeleteAt: getScheduledDeleteDate(),
      organization: getConsultingType(item) || "",
      name: item.name || "",
      email: item.email || "",
      serviceType: item.serviceType || "",
      memo: item.memo || "",
      syncStatus: "pending",
      syncMessage: "Google Sheet 삭제예약 동기화 대기 중",
    };

    const nextRecords = upsertDashboardDeletedRecord(record);

    setDashboardDeletedRecords(nextRecords);
    setItems((prev) => prev.filter((entry) => getTrashKey(entry) !== trashKey));

    alert(
      "대시보드 휴지통 목록에서 삭제했습니다.\nGoogle Sheet 휴지통에는 삭제예약 기록이 백그라운드로 반영됩니다."
    );

    void fetch("/api/permanent-delete-inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trashId,
        trashRow,
      }),
    })
      .then(async (response) => {
        const data = (await response.json()) as {
          ok?: boolean;
          message?: string;
          detail?: string;
          scheduledDeleteAt?: string;
        };

        if (!response.ok || data.ok === false) {
          const updated = updateDashboardDeletedRecord(trashKey, {
            syncStatus: "failed",
            syncMessage:
              data.detail ||
              data.message ||
              "Google Sheet 삭제예약 동기화 실패",
          });
          setDashboardDeletedRecords(updated);
          return;
        }

        const updated = updateDashboardDeletedRecord(trashKey, {
          syncStatus: "synced",
          syncMessage:
            data.message ||
            "Google Sheet 휴지통에 7일 후 삭제예약이 반영되었습니다.",
          scheduledDeleteAt: data.scheduledDeleteAt || record.scheduledDeleteAt,
        });
        setDashboardDeletedRecords(updated);
      })
      .catch((error) => {
        const updated = updateDashboardDeletedRecord(trashKey, {
          syncStatus: "failed",
          syncMessage:
            error instanceof Error
              ? error.message
              : "Google Sheet 삭제예약 동기화 중 오류가 발생했습니다.",
        });
        setDashboardDeletedRecords(updated);
      });
  }

  function removeDashboardRecord(record: DashboardDeletedTrashRecord) {
    const confirmed = window.confirm(
      `[대시보드 삭제기록 제거]\n\n${
        record.organization || record.name || record.trashId || "선택한 기록"
      }\n\n이 기록을 대시보드 삭제기록에서 제거하시겠습니까?\n\nGoogle Sheet 휴지통에 아직 남아 있는 경우, 목록을 다시 불러오면 다시 보일 수 있습니다.`
    );

    if (!confirmed) return;

    const nextRecords = removeDashboardDeletedRecord(record.trashKey);
    setDashboardDeletedRecords(nextRecords);
  }

  useEffect(() => {
    refreshDashboardRecords();
    void loadTrash(true);
  }, []);

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return items;

    return items.filter((item) =>
      [
        item.trashId,
        item.trashRow,
        item.organization,
        getConsultingType(item),
        getCurrentStage(item),
        getConsultingMethod(item),
        getDisplayMessage(item),
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
        item.nextActionDate,
        item.quoteAmount,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, keyword]);

  const filteredDashboardDeletedRecords = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return dashboardDeletedRecords;

    return dashboardDeletedRecords.filter((record) =>
      [
        record.trashId,
        record.trashRow,
        record.organization,
        record.name,
        record.email,
        record.serviceType,
        record.memo,
        record.syncStatus,
        record.syncMessage,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [dashboardDeletedRecords, keyword]);

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
              휴지통 목록은 빠른 처리를 위해 대시보드 삭제기록과 함께
              관리됩니다. 대시보드 삭제 시 화면에서는 즉시 사라지고, Google
              Sheet에는 백그라운드로 삭제예약이 반영됩니다.
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
              Google Sheet 다시 불러오기
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">
              현재 휴지통 표시
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
              대시보드 삭제기록
            </div>
            <div className="mt-3 text-4xl font-bold text-rose-700">
              {dashboardDeletedRecords.length}
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
              placeholder="상담 유형, 성함, 현재 단계, 상담 방식, 문의내용 검색"
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B1F35] xl:w-[520px]"
            />
          </div>

          {errorMessage ? (
            <div className="mt-5 whitespace-pre-wrap rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1800px] table-fixed border-separate border-spacing-y-3">
              <colgroup>
                <col className="w-[140px]" />
                <col className="w-[140px]" />
                <col className="w-[170px]" />
                <col className="w-[110px]" />
                <col className="w-[130px]" />
                <col className="w-[190px]" />
                <col className="w-[150px]" />
                <col className="w-[150px]" />
                <col className="w-[240px]" />
                <col className="w-[90px]" />
                <col className="w-[100px]" />
                <col className="w-[90px]" />
                <col className="w-[130px]" />
              </colgroup>
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-4 py-2 font-semibold">삭제일시</th>
                  <th className="px-4 py-2 font-semibold">접수일시</th>
                  <th className="px-4 py-2 font-semibold">상담 유형</th>
                  <th className="px-4 py-2 font-semibold">성함</th>
                  <th className="px-4 py-2 font-semibold">연락처</th>
                  <th className="px-4 py-2 font-semibold">이메일</th>
                  <th className="px-4 py-2 font-semibold">현재 단계</th>
                  <th className="px-4 py-2 font-semibold">상담 방식</th>
                  <th className="px-4 py-2 font-semibold">문의 내용</th>
                  <th className="px-4 py-2 font-semibold">상태</th>
                  <th className="px-4 py-2 font-semibold">우선순위</th>
                  <th className="px-4 py-2 font-semibold">복원</th>
                  <th className="px-4 py-2 font-semibold">대시보드 삭제</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="rounded-2xl border border-slate-200 bg-[#FCFBF8] px-5 py-10 text-center text-sm font-semibold text-slate-500"
                    >
                      휴지통 목록을 불러오는 중입니다.
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="rounded-2xl border border-slate-200 bg-[#FCFBF8] px-5 py-10 text-center text-sm font-semibold text-slate-500"
                    >
                      현재 표시할 휴지통 문의가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.trashId || item.id}
                      className="text-sm text-slate-700"
                    >
                      <td className="rounded-l-2xl border-y border-l border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {formatDate(item.deletedAt)}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4 font-bold text-[#0B1F35]">
                        <ExpandableCell
                          id={`trash-${getTrashKey(item)}-type`}
                          value={getConsultingType(item) || "-"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <CompactCell value={item.name || "-"} />
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <CompactCell value={item.phone || "-"} />
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <CompactCell value={item.email || "-"} />
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <ExpandableCell
                          id={`trash-${getTrashKey(item)}-stage`}
                          value={getCurrentStage(item) || "-"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <ExpandableCell
                          id={`trash-${getTrashKey(item)}-method`}
                          value={getConsultingMethod(item) || "-"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <ExpandableCell
                          id={`trash-${getTrashKey(item)}-message`}
                          value={getDisplayMessage(item) || "-"}
                          expandedCell={expandedCell}
                          setExpandedCell={setExpandedCell}
                        />
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
                          onClick={() => dashboardDeleteInquiry(item)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          대시보드 삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0B1F35]">
                대시보드 삭제기록
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                대시보드에서 삭제한 휴지통 항목은 이곳에 기록됩니다. Google
                Sheet에는 백그라운드로 7일 후 삭제예약이 반영됩니다.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshDashboardRecords}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              삭제기록 새로고침
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[1200px] border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-4 py-2 font-semibold">대시보드 삭제일</th>
                  <th className="px-4 py-2 font-semibold">삭제예약일</th>
                  <th className="px-4 py-2 font-semibold">상담 유형</th>
                  <th className="px-4 py-2 font-semibold">성함</th>
                  <th className="px-4 py-2 font-semibold">이메일</th>
                  <th className="px-4 py-2 font-semibold">서비스유형</th>
                  <th className="px-4 py-2 font-semibold">동기화 상태</th>
                  <th className="px-4 py-2 font-semibold">기록 제거</th>
                </tr>
              </thead>

              <tbody>
                {filteredDashboardDeletedRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="rounded-2xl border border-slate-200 bg-[#FCFBF8] px-5 py-10 text-center text-sm font-semibold text-slate-500"
                    >
                      대시보드 삭제기록이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredDashboardDeletedRecords.map((record) => (
                    <tr key={record.trashKey} className="text-sm text-slate-700">
                      <td className="rounded-l-2xl border-y border-l border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {formatDate(record.deletedAt)}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {formatDate(record.scheduledDeleteAt)}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4 font-bold text-[#0B1F35]">
                        {record.organization || "-"}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {record.name || "-"}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {record.email || "-"}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        {record.serviceType || "-"}
                      </td>
                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <div className="font-semibold">
                          {record.syncStatus === "pending"
                            ? "동기화 대기"
                            : record.syncStatus === "synced"
                              ? "동기화 완료"
                              : "동기화 실패"}
                        </div>
                        <div className="mt-1 max-w-[280px] text-xs leading-5 text-slate-500">
                          {record.syncMessage}
                        </div>
                      </td>
                      <td className="rounded-r-2xl border-y border-r border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <button
                          type="button"
                          onClick={() => removeDashboardRecord(record)}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                          기록 제거
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

function CompactCell({ value }: { value: string }) {
  return (
    <div className="truncate" title={value}>
      {value || "-"}
    </div>
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
      className={`block w-full rounded-xl px-2 py-1 text-left transition ${
        isExpanded
          ? "whitespace-pre-wrap break-words bg-white text-[#0B1F35] shadow-sm"
          : "truncate hover:bg-white/70"
      }`}
    >
      {value || "-"}
    </button>
  );
}
