"use client";

import { useEffect, useMemo, useState } from "react";

type InquiryStatus =
  | "new"
  | "consulting"
  | "proposal"
  | "negotiation"
  | "contract";

type InquiryPriority = "low" | "medium" | "high" | "vip";

type InquiryItem = {
  id: string;
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  sourcePage: string;
  serviceType: string;
  status: InquiryStatus;
  createdAt: string;
  memo?: string;
  priority?: InquiryPriority;
  managerName?: string;
  nextActionAt?: string | null;
  quoteAmount?: number | null;
};

type ReadinessGrade = "BASIC" | "READY-1" | "READY-2" | "READY-3" | "UNKNOWN";

type ChecklistLead = InquiryItem & {
  readinessGrade: ReadinessGrade;
  readinessLevel: string;
  readinessPercent: number;
  checkedCount: number;
  totalCount: number;
  analysisTitle: string;
  checkedItems: string[];
  nextActions: string[];
};

type GradeFilter = ReadinessGrade | "all";

const gradeLabelMap: Record<ReadinessGrade, string> = {
  BASIC: "BASIC",
  "READY-1": "READY-1",
  "READY-2": "READY-2",
  "READY-3": "READY-3",
  UNKNOWN: "UNKNOWN",
};

const gradeDescriptionMap: Record<ReadinessGrade, string> = {
  BASIC: "준비 초기",
  "READY-1": "기초 준비",
  "READY-2": "실무 준비",
  "READY-3": "신청 준비",
  UNKNOWN: "등급 미확인",
};

const gradeBadgeClassMap: Record<ReadinessGrade, string> = {
  BASIC: "border-rose-200 bg-rose-50 text-rose-700",
  "READY-1": "border-amber-200 bg-amber-50 text-amber-700",
  "READY-2": "border-blue-200 bg-blue-50 text-blue-700",
  "READY-3": "border-emerald-200 bg-emerald-50 text-emerald-700",
  UNKNOWN: "border-slate-200 bg-slate-50 text-slate-600",
};

const gradeBarClassMap: Record<ReadinessGrade, string> = {
  BASIC: "bg-rose-500",
  "READY-1": "bg-amber-500",
  "READY-2": "bg-blue-500",
  "READY-3": "bg-emerald-500",
  UNKNOWN: "bg-slate-400",
};

const statusLabelMap: Record<InquiryStatus, string> = {
  new: "신규",
  consulting: "상담중",
  proposal: "견적발송",
  negotiation: "계약검토",
  contract: "계약완료",
};

const statusBadgeClassMap: Record<InquiryStatus, string> = {
  new: "border-amber-200 bg-amber-50 text-amber-700",
  consulting: "border-blue-200 bg-blue-50 text-blue-700",
  proposal: "border-violet-200 bg-violet-50 text-violet-700",
  negotiation: "border-orange-200 bg-orange-50 text-orange-700",
  contract: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function normalizeGrade(value: string): ReadinessGrade {
  const text = value.trim().toUpperCase();

  if (text === "BASIC") return "BASIC";
  if (text === "READY-1") return "READY-1";
  if (text === "READY-2") return "READY-2";
  if (text === "READY-3") return "READY-3";

  return "UNKNOWN";
}

function extractLineValue(message: string, label: string): string {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`${escapedLabel}\\s*:\\s*(.+)`);
  const match = message.match(regex);
  return match?.[1]?.trim() ?? "";
}

function extractSectionLines(
  message: string,
  startLabel: string,
  endLabels: string[]
): string[] {
  const startIndex = message.indexOf(startLabel);

  if (startIndex < 0) return [];

  const sectionStart = startIndex + startLabel.length;
  const rest = message.slice(sectionStart);

  let sectionEnd = rest.length;

  for (const label of endLabels) {
    const index = rest.indexOf(label);
    if (index >= 0 && index < sectionEnd) {
      sectionEnd = index;
    }
  }

  const section = rest.slice(0, sectionEnd);

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);
}

function parseCheckedCount(value: string): {
  checkedCount: number;
  totalCount: number;
} {
  const match = value.match(/(\d+)\s*\/\s*(\d+)/);

  if (!match) {
    return {
      checkedCount: 0,
      totalCount: 0,
    };
  }

  return {
    checkedCount: Number(match[1] ?? 0),
    totalCount: Number(match[2] ?? 0),
  };
}

function parsePercent(value: string): number {
  const match = value.match(/(\d+)/);
  if (!match) return 0;

  const numberValue = Number(match[1]);
  if (Number.isNaN(numberValue)) return 0;

  return Math.max(0, Math.min(100, numberValue));
}

function parseAnalysisTitle(message: string): string {
  const marker = "분석 요약:";
  const index = message.indexOf(marker);

  if (index < 0) return "";

  const rest = message.slice(index + marker.length);
  const lines = rest
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines[0] ?? "";
}

function isChecklistMessage(message: string): boolean {
  return message.includes("[공익법인 설립 자가진단 결과]");
}

function toChecklistLead(item: InquiryItem): ChecklistLead | null {
  if (!isChecklistMessage(item.message)) return null;

  const gradeRaw = extractLineValue(item.message, "준비도 등급");
  const level = extractLineValue(item.message, "준비 단계");
  const countRaw = extractLineValue(item.message, "체크 현황");
  const percentRaw = extractLineValue(item.message, "준비도");

  const { checkedCount, totalCount } = parseCheckedCount(countRaw);

  return {
    ...item,
    readinessGrade: normalizeGrade(gradeRaw),
    readinessLevel: level || "준비 단계 미확인",
    readinessPercent: parsePercent(percentRaw),
    checkedCount,
    totalCount,
    analysisTitle: parseAnalysisTitle(item.message),
    checkedItems: extractSectionLines(item.message, "체크한 항목:", [
      "다음 조치:",
      "상담 요청:",
    ]),
    nextActions: extractSectionLines(item.message, "다음 조치:", [
      "상담 요청:",
    ]),
  };
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "-";
  }

  return date.toLocaleString("ko-KR");
}

function getPrioritySuggestion(lead: ChecklistLead): string {
  if (lead.readinessGrade === "READY-3") {
    return "최우선 상담";
  }

  if (lead.readinessGrade === "READY-2") {
    return "우선 상담";
  }

  if (lead.readinessGrade === "READY-1") {
    return "진단 상담";
  }

  if (lead.readinessGrade === "BASIC") {
    return "방향 상담";
  }

  return "확인 필요";
}

function getPrioritySuggestionClass(lead: ChecklistLead): string {
  if (lead.readinessGrade === "READY-3") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (lead.readinessGrade === "READY-2") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (lead.readinessGrade === "READY-1") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (lead.readinessGrade === "BASIC") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

export default function ChecklistLeadsAdminPage() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<ChecklistLead | null>(null);

  async function loadInquiries(): Promise<void> {
    try {
      setLoading(true);

      const response = await fetch("/api/inquiry", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as {
        ok?: boolean;
        items?: InquiryItem[];
      };

      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadInquiries();
  }, []);

  const checklistLeads = useMemo(() => {
    return items
      .map(toChecklistLead)
      .filter((item): item is ChecklistLead => item !== null)
      .sort((a, b) => {
        const gradeWeight: Record<ReadinessGrade, number> = {
          "READY-3": 4,
          "READY-2": 3,
          "READY-1": 2,
          BASIC: 1,
          UNKNOWN: 0,
        };

        const gradeDiff =
          gradeWeight[b.readinessGrade] - gradeWeight[a.readinessGrade];

        if (gradeDiff !== 0) return gradeDiff;

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [items]);

  const filteredLeads = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return checklistLeads.filter((lead) => {
      const matchesGrade =
        gradeFilter === "all" ? true : lead.readinessGrade === gradeFilter;

      const matchesKeyword = keyword
        ? [
            lead.organization,
            lead.name,
            lead.phone,
            lead.email,
            lead.serviceType,
            lead.sourcePage,
            lead.message,
            lead.readinessGrade,
            lead.readinessLevel,
            lead.analysisTitle,
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        : true;

      return matchesGrade && matchesKeyword;
    });
  }, [checklistLeads, gradeFilter, searchKeyword]);

  const summary = useMemo(() => {
    const countByGrade = {
      BASIC: checklistLeads.filter((lead) => lead.readinessGrade === "BASIC")
        .length,
      "READY-1": checklistLeads.filter(
        (lead) => lead.readinessGrade === "READY-1"
      ).length,
      "READY-2": checklistLeads.filter(
        (lead) => lead.readinessGrade === "READY-2"
      ).length,
      "READY-3": checklistLeads.filter(
        (lead) => lead.readinessGrade === "READY-3"
      ).length,
      UNKNOWN: checklistLeads.filter(
        (lead) => lead.readinessGrade === "UNKNOWN"
      ).length,
    };

    return {
      total: checklistLeads.length,
      priorityCount: countByGrade["READY-2"] + countByGrade["READY-3"],
      countByGrade,
    };
  }, [checklistLeads]);

  const gradeOptions: Array<{
    value: GradeFilter;
    label: string;
  }> = [
    { value: "all", label: "전체" },
    { value: "BASIC", label: "BASIC" },
    { value: "READY-1", label: "READY-1" },
    { value: "READY-2", label: "READY-2" },
    { value: "READY-3", label: "READY-3" },
    { value: "UNKNOWN", label: "UNKNOWN" },
  ];

  return (
    <main className="min-h-screen bg-[#F6F3EE] px-6 py-10 text-slate-900 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[1680px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
              Admin CRM · Checklist Leads
            </div>
            <h1 className="mt-3 text-3xl font-bold text-[#0B1F35] md:text-4xl">
              공익법인 자가진단 리드 분석
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              체크리스트 페이지에서 상담 신청한 문의를 자동으로 추출하여 준비도
              등급, 체크 현황, 상담 우선순위를 한눈에 확인합니다.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#0B1F35] shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50 hover:shadow-md"
            >
              기본 관리자 보기
            </a>

            <button
              type="button"
              onClick={() => {
                void loadInquiries();
              }}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#0B1F35] shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50 hover:shadow-md"
            >
              새로고침
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">
              전체 자가진단 리드
            </div>
            <div className="mt-3 text-3xl font-bold text-[#0B1F35]">
              {summary.total}
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="text-sm font-semibold text-emerald-700">
              우선 상담 대상
            </div>
            <div className="mt-3 text-3xl font-bold text-emerald-800">
              {summary.priorityCount}
            </div>
            <div className="mt-2 text-xs font-medium text-emerald-700">
              READY-2 + READY-3
            </div>
          </div>

          {(["BASIC", "READY-1", "READY-2", "READY-3"] as ReadinessGrade[]).map(
            (grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setGradeFilter(grade)}
                className={`rounded-[28px] border p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-[1px] ${
                  gradeFilter === grade
                    ? "border-[#0B1F35] bg-[#0B1F35] text-white"
                    : `${gradeBadgeClassMap[grade]}`
                }`}
              >
                <div className="text-sm font-semibold">
                  {gradeLabelMap[grade]}
                </div>
                <div className="mt-3 text-3xl font-bold">
                  {summary.countByGrade[grade]}
                </div>
                <div className="mt-2 text-xs font-medium">
                  {gradeDescriptionMap[grade]}
                </div>
              </button>
            )
          )}
        </div>

        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-lg font-bold text-[#0B1F35]">
                자가진단 리드 목록
              </div>
              <div className="mt-1 text-sm text-slate-500">
                문의내용에 자가진단 결과가 포함된 상담만 표시됩니다.
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="기관명, 담당자명, 연락처, 이메일, 등급, 문의내용 검색"
                className="w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#0B1F35] md:w-[420px]"
              />

              <div className="flex flex-wrap gap-2">
                {gradeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGradeFilter(option.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      gradeFilter === option.value
                        ? "border-[#0B1F35] bg-[#0B1F35] text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-4 py-2 font-semibold">접수일시</th>
                  <th className="px-4 py-2 font-semibold">기관명</th>
                  <th className="px-4 py-2 font-semibold">담당자</th>
                  <th className="px-4 py-2 font-semibold">준비도</th>
                  <th className="px-4 py-2 font-semibold">체크</th>
                  <th className="px-4 py-2 font-semibold">상담 우선순위</th>
                  <th className="px-4 py-2 font-semibold">상태</th>
                  <th className="px-4 py-2 font-semibold">상세</th>
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
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] px-4 py-8 text-center text-sm text-slate-500"
                    >
                      표시할 자가진단 리드가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="align-top">
                      <td className="rounded-l-[24px] border-y border-l border-slate-200 bg-[#FCFBF8] px-4 py-4 text-sm text-slate-700">
                        {formatDateTime(lead.createdAt)}
                      </td>

                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <div className="font-bold text-[#0B1F35]">
                          {lead.organization || "-"}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {lead.serviceType || "-"}
                        </div>
                      </td>

                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4 text-sm text-slate-700">
                        <div className="font-semibold text-[#0B1F35]">
                          {lead.name || "-"}
                        </div>
                        <div className="mt-1">{lead.phone || "-"}</div>
                        <div className="mt-1 break-all text-xs text-slate-500">
                          {lead.email || "-"}
                        </div>
                      </td>

                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${gradeBadgeClassMap[lead.readinessGrade]}`}
                        >
                          {lead.readinessGrade}
                        </span>
                        <div className="mt-2 text-sm font-semibold text-[#0B1F35]">
                          {lead.readinessLevel}
                        </div>
                        <div className="mt-3 h-2 w-[140px] overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              gradeBarClassMap[lead.readinessGrade]
                            }`}
                            style={{ width: `${lead.readinessPercent}%` }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {lead.readinessPercent}%
                        </div>
                      </td>

                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4 text-sm font-semibold text-slate-700">
                        {lead.checkedCount}/{lead.totalCount}
                      </td>

                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getPrioritySuggestionClass(
                            lead
                          )}`}
                        >
                          {getPrioritySuggestion(lead)}
                        </span>
                      </td>

                      <td className="border-y border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusBadgeClassMap[lead.status]}`}
                        >
                          {statusLabelMap[lead.status]}
                        </span>
                      </td>

                      <td className="rounded-r-[24px] border-y border-r border-slate-200 bg-[#FCFBF8] px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedLead ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-10">
          <div className="max-h-[90vh] w-full max-w-[980px] overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
                  Checklist Lead Detail
                </div>
                <h2 className="mt-3 text-3xl font-bold text-[#0B1F35]">
                  {selectedLead.organization || "-"}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${gradeBadgeClassMap[selectedLead.readinessGrade]}`}
                  >
                    {selectedLead.readinessGrade}
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getPrioritySuggestionClass(
                      selectedLead
                    )}`}
                  >
                    {getPrioritySuggestion(selectedLead)}
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusBadgeClassMap[selectedLead.status]}`}
                  >
                    {statusLabelMap[selectedLead.status]}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50"
              >
                닫기
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
                <div className="text-sm font-semibold text-slate-500">
                  담당자명
                </div>
                <div className="mt-2 text-lg font-bold text-[#0B1F35]">
                  {selectedLead.name || "-"}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
                <div className="text-sm font-semibold text-slate-500">
                  연락처
                </div>
                <div className="mt-2 text-lg font-bold text-[#0B1F35]">
                  {selectedLead.phone || "-"}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
                <div className="text-sm font-semibold text-slate-500">
                  이메일
                </div>
                <div className="mt-2 break-all text-lg font-bold text-[#0B1F35]">
                  {selectedLead.email || "-"}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
                <div className="text-sm font-semibold text-slate-500">
                  접수일시
                </div>
                <div className="mt-2 text-lg font-bold text-[#0B1F35]">
                  {formatDateTime(selectedLead.createdAt)}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] border border-slate-200 bg-[#081A2F] p-6 text-white">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E5C996]">
                  Readiness
                </div>
                <div className="mt-4 text-4xl font-bold">
                  {selectedLead.readinessPercent}%
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  {selectedLead.checkedCount}/{selectedLead.totalCount} 체크
                </div>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${
                      gradeBarClassMap[selectedLead.readinessGrade]
                    }`}
                    style={{ width: `${selectedLead.readinessPercent}%` }}
                  />
                </div>

                <div className="mt-6 rounded-[20px] bg-white/8 p-4">
                  <div className="text-sm text-slate-300">분석 요약</div>
                  <div className="mt-2 text-lg font-bold leading-8">
                    {selectedLead.analysisTitle || "-"}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-[#FCFBF8] p-6">
                <div className="text-lg font-bold text-[#0B1F35]">
                  체크한 항목
                </div>
                <div className="mt-4 grid gap-3">
                  {selectedLead.checkedItems.length > 0 ? (
                    selectedLead.checkedItems.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-700"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-500">
                      체크한 항목이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-slate-200 bg-[#FCFBF8] p-6">
              <div className="text-lg font-bold text-[#0B1F35]">
                다음 조치 가이드
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {selectedLead.nextActions.length > 0 ? (
                  selectedLead.nextActions.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-700"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-500">
                    다음 조치 항목이 없습니다.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6">
              <div className="text-lg font-bold text-[#0B1F35]">
                문의내용 전체
              </div>
              <div className="mt-4 max-h-[360px] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl bg-[#F8F6F1] p-5 text-sm leading-8 text-slate-700">
                {selectedLead.message || "-"}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${selectedLead.email}?subject=${encodeURIComponent(
                  `[NPOLAP 공익법인 상담] ${selectedLead.organization || ""}`
                )}&body=${encodeURIComponent(
                  `${selectedLead.name || ""}님 안녕하세요.\n\n공익법인 설립 자가진단 결과를 확인했습니다.\n\n준비도 등급: ${selectedLead.readinessGrade}\n준비 단계: ${selectedLead.readinessLevel}\n체크 현황: ${selectedLead.checkedCount}/${selectedLead.totalCount}\n준비도: ${selectedLead.readinessPercent}%\n\n상담 일정을 조율드리고자 연락드립니다.\n\n감사합니다.`
                )}`}
                className="inline-flex items-center justify-center rounded-full bg-[#081A2F] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,31,53,0.14)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_45px_rgba(11,31,53,0.20)]"
              >
                이메일 답장하기
              </a>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}