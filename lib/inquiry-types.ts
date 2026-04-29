export const INQUIRY_STATUS_ORDER = [
  "new",
  "consulting",
  "proposal",
  "negotiation",
  "contract",
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUS_ORDER)[number];

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "신규",
  consulting: "상담",
  proposal: "제안",
  negotiation: "협의",
  contract: "계약",
};

export const INQUIRY_STATUS_CLASS: Record<InquiryStatus, string> = {
  new: "bg-amber-50 text-amber-700 border-amber-200",
  consulting: "bg-blue-50 text-blue-700 border-blue-200",
  proposal: "bg-violet-50 text-violet-700 border-violet-200",
  negotiation: "bg-orange-50 text-orange-700 border-orange-200",
  contract: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export type InquiryPriority = "low" | "medium" | "high" | "vip";

export type InquiryItem = {
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

export type InquiryFormPayload = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  sourcePage: string;
  serviceType: string;
};