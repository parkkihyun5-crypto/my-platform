"use client";

import FormInput from "@/components/FormInput";
import { useState } from "react";

type TrademarkItem = {
  applicationNumber?: string;
  registrationNumber?: string;
  title?: string;
  applicantName?: string;
  status?: string;
  imageUrl?: string;
  publicationDate?: string;
  designationGoods?: string;
};

type SearchResponse = {
  ok?: boolean;
  message?: string;
  detail?: string;
  count?: number;
  items?: TrademarkItem[];
};

export default function TrademarkSearchPanel() {
  const [keyword, setKeyword] = useState<string>("");
  const [classification, setClassification] = useState<string>("");
  const [items, setItems] = useState<TrademarkItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  async function handleSearch(): Promise<void> {
    if (!keyword.trim()) {
      alert("검색할 상표명을 입력해 주세요.");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const params = new URLSearchParams({
        keyword: keyword.trim(),
      });

      if (classification.trim()) {
        params.set("classification", classification.trim());
      }

      const response = await fetch(`/api/trademark-search?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = (await response.json()) as SearchResponse;

      if (!response.ok || !result.ok) {
        alert(
          result.detail
            ? `${result.message ?? "상표검색 실패"}\n\n${result.detail}`
            : result.message ?? "상표검색 실패"
        );
        setItems([]);
        return;
      }

      setItems(Array.isArray(result.items) ? result.items : []);
    } catch (error) {
      alert(
        error instanceof Error
          ? `상표검색 중 오류가 발생했습니다.\n\n${error.message}`
          : "상표검색 중 오류가 발생했습니다."
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
            TRADEMARK
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[#0B1F35] md:text-5xl">
            상표등록 검색 및 출원 준비
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-slate-600 md:text-lg">
            KIPRIS 검색 결과를 사이트 안에서 바로 확인할 수 있도록 구성한 검색 블록입니다.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
              SEARCH
            </div>
            <h3 className="mt-4 text-2xl font-bold text-[#0B1F35] md:text-4xl">
              상표검색
            </h3>

            <div className="mt-3 rounded-2xl bg-[#F8F6F1] px-4 py-4 text-sm leading-7 text-slate-600">
              상표명만 입력해도 검색할 수 있으며,
              <br />
              상품류 또는 서비스류를 함께 입력하면 검색 범위를 좁혀볼 수 있습니다.
            </div>

            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSearch();
                }
              }}
              className="mt-6 grid gap-4"
            >
              <FormInput
                value={keyword}
                onChange={setKeyword}
                placeholder="검색할 상표명을 입력해 주세요."
              />
              <FormInput
                value={classification}
                onChange={setClassification}
                placeholder="상품류 또는 서비스류를 입력해 주세요."
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  void handleSearch();
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#081A2F] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,31,53,0.14)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_45px_rgba(11,31,53,0.20)] md:px-7 md:py-4 md:text-base"
              >
                {loading ? "검색 중..." : "검색하기"}
              </button>
            </div>

            <div className="mt-6 rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
                SEARCH GUIDE
              </div>

              <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
                <div className="rounded-2xl bg-white px-4 py-4">
                  상표명 중심으로 먼저 검색하고, 유사 상표가 많은 경우 상품류를 추가해 보세요.
                </div>
                <div className="rounded-2xl bg-white px-4 py-4">
                  예시: 삼성 / 35류, Heritage Office / 41류
                </div>
                <div className="rounded-2xl bg-white px-4 py-4">
                  엔터로 바로 검색하려면 상표명 입력 후 키보드 Enter를 눌러도 됩니다.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
                  RESULT
                </div>
                <h3 className="mt-4 text-2xl font-bold text-[#0B1F35] md:text-4xl">
                  검색 결과
                </h3>
              </div>
            </div>

            <div className="mt-6">
              {!searched ? (
                <div className="rounded-[24px] bg-[#F8F6F1] px-5 py-10 text-center text-sm text-slate-500">
                  검색어를 입력하면 이 영역에 결과가 표시됩니다.
                </div>
              ) : loading ? (
                <div className="rounded-[24px] bg-[#F8F6F1] px-5 py-10 text-center text-sm text-slate-500">
                  검색 중입니다.
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-[24px] bg-[#F8F6F1] px-5 py-10 text-center text-sm text-slate-500">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div className="grid gap-4">
                  {items.map((item, index) => (
                    <div
                      key={`${item.applicationNumber ?? "no-app"}-${index}`}
                      className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-start">
                        <div className="flex-1">
                          <div className="text-lg font-bold text-[#0B1F35] md:text-2xl">
                            {item.title || "상표명 정보 없음"}
                          </div>

                          <div className="mt-4 grid gap-2 text-sm leading-7 text-slate-700">
                            <div>
                              <span className="font-semibold text-slate-500">출원번호:</span>{" "}
                              {item.applicationNumber || "-"}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-500">등록번호:</span>{" "}
                              {item.registrationNumber || "-"}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-500">출원인:</span>{" "}
                              {item.applicantName || "-"}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-500">상태:</span>{" "}
                              {item.status || "-"}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-500">일자:</span>{" "}
                              {item.publicationDate || "-"}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-500">지정상품:</span>{" "}
                              {item.designationGoods || "-"}
                            </div>
                          </div>
                        </div>

                        {item.imageUrl ? (
                          <div className="w-full md:w-[180px]">
                            <img
                              src={item.imageUrl}
                              alt={item.title || "trademark"}
                              className="w-full rounded-2xl border border-slate-200 bg-white object-contain p-3"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
                PREPARATION
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  "상표명 또는 로고 확정",
                  "유사 상표 사전 검색",
                  "지정상품 및 서비스류 검토",
                  "출원인 정보 준비",
                  "사용 계획 또는 실제 사용 여부 확인",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}