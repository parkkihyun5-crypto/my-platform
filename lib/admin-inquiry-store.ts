import type { InquiryItem, InquiryStatus } from "@/lib/inquiry-types";

declare global {
  // eslint-disable-next-line no-var
  var __NPOLAP_INQUIRIES__: InquiryItem[] | undefined;
}

const inquiryStore = globalThis.__NPOLAP_INQUIRIES__ ?? [];
globalThis.__NPOLAP_INQUIRIES__ = inquiryStore;

export function addInquiry(item: InquiryItem): InquiryItem {
  inquiryStore.unshift(item);
  return item;
}

export function listInquiries(): InquiryItem[] {
  return [...inquiryStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): InquiryItem | null {
  const target = inquiryStore.find((item) => item.id === id);
  if (!target) return null;
  target.status = status;
  return target;
}