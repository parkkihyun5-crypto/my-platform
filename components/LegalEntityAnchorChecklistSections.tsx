"use client";

import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import { submitInquiry } from "@/lib/inquiry-client";
import { useMemo, useState } from "react";

type ChecklistRow = {
  category: string;
  document: string;
  checkPoint: string;
};

type ChecklistSection = {
  id: string;
  badge: string;
  title: string;
  description: string;
  rows: ChecklistRow[];
};

type SelectedSectionSummary = {
  sectionTitle: string;
  checkedCount: number;
  totalCount: number;
  percent: number;
  checkedRows: ChecklistRow[];
};

type InquiryFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

const CHECKLIST_STORAGE_KEY = "npolap_public_interest_checklist_result";

const checklistSections: ChecklistSection[] = [
  {
    id: "public-benefit",
    badge: "Public Benefit Foundation",
    title: "공익법인 설립 제출서류 체크리스트",
    description:
      "공익법인 설립은 정관, 출연재산, 사업계획, 수지예산, 공시체계가 하나의 논리로 연결되어야 합니다.",
    rows: [
      {
        category: "기본",
        document: "설립허가 신청서",
        checkPoint: "법인명, 소재지, 대표자, 목적사업 기재",
      },
      {
        category: "기본",
        document: "정관",
        checkPoint: "목적, 사업, 재산, 임원, 이사회, 회계, 해산 조항",
      },
      {
        category: "회의",
        document: "발기인 총회 의사록 또는 창립총회 의사록",
        checkPoint: "설립 결의, 정관 승인, 임원 선임, 사업계획·예산 승인",
      },
      {
        category: "인적",
        document: "발기인 명부",
        checkPoint: "성명, 주소, 생년월일, 날인 여부",
      },
      {
        category: "인적",
        document: "임원 명부",
        checkPoint: "이사·감사 구성, 임기, 직위",
      },
      {
        category: "인적",
        document: "임원 취임승낙서",
        checkPoint: "본인 서명 또는 인감 날인",
      },
      {
        category: "인적",
        document: "임원 이력서",
        checkPoint: "전문성, 공익사업 관련 경력",
      },
      {
        category: "인적",
        document: "임원 결격사유 확인서",
        checkPoint: "법령상 결격사유 없음 확인",
      },
      {
        category: "재산",
        document: "재산목록",
        checkPoint: "기본재산·보통재산 구분",
      },
      {
        category: "재산",
        document: "출연확인서 또는 출연재산 증여계약서",
        checkPoint: "출연 의사의 확정성, 조건부 출연 여부",
      },
      {
        category: "재산",
        document: "금융기관 잔고증명서",
        checkPoint: "현금 출연금 예치 여부",
      },
      {
        category: "재산",
        document: "부동산 등기사항전부증명서",
        checkPoint: "부동산 출연 시 소유권·담보·가압류 확인",
      },
      {
        category: "재산",
        document: "감정평가서 또는 평가자료",
        checkPoint: "부동산·미술품·문화자산 등 평가 필요 시",
      },
      {
        category: "사업",
        document: "사업계획서",
        checkPoint: "목적사업, 수혜 대상, 일정, 실행 방법",
      },
      {
        category: "예산",
        document: "수지예산서",
        checkPoint: "사업계획과 예산 항목의 일치 여부",
      },
      {
        category: "사무소",
        document: "사무소 임대차계약서 또는 사용승낙서",
        checkPoint: "실제 사무소 확보 여부",
      },
      {
        category: "운영",
        document: "회계관리 계획서",
        checkPoint: "회계 담당자, 장부, 결산 체계",
      },
      {
        category: "공시",
        document: "홈페이지 또는 공시계획",
        checkPoint: "기부금·사업실적 공개 계획",
      },
    ],
  },
  {
    id: "foundation",
    badge: "Foundation",
    title: "재단법인 설립 제출서류 체크리스트",
    description:
      "재단법인은 사람보다 재산을 중심으로 설립되는 법인이므로 출연재산의 확정성, 기본재산의 안정성, 이사회 구조가 핵심입니다.",
    rows: [
      {
        category: "기본",
        document: "재단법인 설립허가 신청서",
        checkPoint: "법인명, 목적, 소재지, 대표자",
      },
      {
        category: "기본",
        document: "설립취지서",
        checkPoint: "재단 설립의 필요성, 공익성, 사회적 목적",
      },
      {
        category: "기본",
        document: "정관",
        checkPoint: "재산 중심 법인 구조, 이사회, 기본재산 처분 제한",
      },
      {
        category: "회의",
        document: "설립자 회의록 또는 발기인 회의록",
        checkPoint: "정관 승인, 임원 선임, 출연재산 확정",
      },
      {
        category: "인적",
        document: "설립자 인적사항",
        checkPoint: "출연자, 발기인 정보",
      },
      {
        category: "인적",
        document: "임원 명부",
        checkPoint: "이사·감사 구성",
      },
      {
        category: "인적",
        document: "임원 취임승낙서",
        checkPoint: "취임 의사 확인",
      },
      {
        category: "인적",
        document: "임원 이력서",
        checkPoint: "전문성, 재단 목적과의 관련성",
      },
      {
        category: "인적",
        document: "임원 인감증명서",
        checkPoint: "등기 및 허가 절차용",
      },
      {
        category: "재산",
        document: "출연재산 목록",
        checkPoint: "기본재산·보통재산 구분",
      },
      {
        category: "재산",
        document: "출연확인서",
        checkPoint: "출연 의사의 확정성",
      },
      {
        category: "재산",
        document: "금융기관 잔고증명서",
        checkPoint: "현금 출연재산 확인",
      },
      {
        category: "재산",
        document: "부동산 등기사항전부증명서",
        checkPoint: "부동산 출연 시 권리관계 확인",
      },
      {
        category: "재산",
        document: "감정평가서",
        checkPoint: "부동산, 미술품, 유물, 고가 동산 출연 시",
      },
      {
        category: "사업",
        document: "사업계획서",
        checkPoint: "재단 목적사업의 구체성",
      },
      {
        category: "예산",
        document: "수지예산서",
        checkPoint: "출연재산 운용수익과 사업비 연결",
      },
      {
        category: "사무소",
        document: "사무소 사용권한 증빙",
        checkPoint: "임대차계약서, 사용승낙서",
      },
      {
        category: "운영",
        document: "이사회 운영계획",
        checkPoint: "회의 주기, 의결 구조, 감사 체계",
      },
    ],
  },
  {
    id: "medical",
    badge: "Medical Foundation",
    title: "의료재단·의료법인 설립 제출서류 체크리스트",
    description:
      "의료법인은 공익성뿐 아니라 의료기관 개설 가능성, 시설 기준, 의료인력, 장비, 운영수지까지 함께 심사됩니다.",
    rows: [
      {
        category: "기본",
        document: "의료법인 설립허가 신청서",
        checkPoint: "설립자, 목적, 의료기관 운영계획",
      },
      {
        category: "기본",
        document: "설립취지서",
        checkPoint: "지역 의료 필요성, 공익성",
      },
      {
        category: "기본",
        document: "정관",
        checkPoint: "의료기관 운영, 재산, 임원, 이사회, 해산",
      },
      {
        category: "인적",
        document: "설립발기인 명부",
        checkPoint: "발기인 자격, 인적사항",
      },
      {
        category: "인적",
        document: "임원 명부",
        checkPoint: "의료·회계·행정 전문성",
      },
      {
        category: "인적",
        document: "임원 취임승낙서",
        checkPoint: "취임 의사 확인",
      },
      {
        category: "인적",
        document: "임원 이력서",
        checkPoint: "의료기관 운영 관련 경력",
      },
      {
        category: "인적",
        document: "결격사유 확인서",
        checkPoint: "의료법상 결격 여부",
      },
      {
        category: "재산",
        document: "재산목록",
        checkPoint: "기본재산·보통재산 구분",
      },
      {
        category: "재산",
        document: "출연확인서",
        checkPoint: "출연재산 확정성",
      },
      {
        category: "재산",
        document: "잔고증명서",
        checkPoint: "운영자금 확보 여부",
      },
      {
        category: "재산",
        document: "부동산 등기사항전부증명서",
        checkPoint: "병원 부지·건물 소유권 확인",
      },
      {
        category: "시설",
        document: "의료기관 시설계획서",
        checkPoint: "병상 수, 진료과목, 공간 구성",
      },
      {
        category: "시설",
        document: "건축물대장 또는 도면",
        checkPoint: "의료시설 기준 적합성",
      },
      {
        category: "인력",
        document: "의료인력 확보계획서",
        checkPoint: "의사, 간호사, 행정인력 계획",
      },
      {
        category: "장비",
        document: "의료장비 확보계획서",
        checkPoint: "진료과목별 장비 계획",
      },
      {
        category: "사업",
        document: "병원 운영계획서",
        checkPoint: "진료과목, 환자 수요, 운영수지",
      },
      {
        category: "예산",
        document: "수지예산서",
        checkPoint: "개원비, 인건비, 장비비, 운영비",
      },
      {
        category: "지역성",
        document: "지역 의료수요 분석자료",
        checkPoint: "의료기관 필요성 입증",
      },
    ],
  },
  {
    id: "school",
    badge: "School Foundation",
    title: "학교법인 설립 제출서류 체크리스트",
    description:
      "학교법인은 교육 목적의 공공성, 교지·교사 확보, 수익용 기본재산, 교원 확보계획, 교육수요가 핵심입니다.",
    rows: [
      {
        category: "기본",
        document: "학교법인 설립허가 신청서",
        checkPoint: "설립 목적, 학교 종류, 명칭",
      },
      {
        category: "기본",
        document: "설립취지서",
        checkPoint: "교육 목적, 지역 교육수요, 공공성",
      },
      {
        category: "기본",
        document: "정관",
        checkPoint: "학교 설치·경영, 자산, 회계, 임원, 이사회",
      },
      {
        category: "회의",
        document: "설립자 회의록",
        checkPoint: "정관 승인, 임원 선임, 재산 출연 결의",
      },
      {
        category: "인적",
        document: "설립자 명부",
        checkPoint: "설립자 인적사항",
      },
      {
        category: "인적",
        document: "임원 명부",
        checkPoint: "이사·감사 구성",
      },
      {
        category: "인적",
        document: "임원 취임승낙서",
        checkPoint: "취임 의사 확인",
      },
      {
        category: "인적",
        document: "임원 이력서",
        checkPoint: "교육·행정·회계 전문성",
      },
      {
        category: "인적",
        document: "임원 결격사유 확인서",
        checkPoint: "사립학교법상 결격 여부",
      },
      {
        category: "재산",
        document: "기본재산 목록",
        checkPoint: "교육용 기본재산·수익용 기본재산",
      },
      {
        category: "재산",
        document: "출연확인서",
        checkPoint: "재산 출연 확정 여부",
      },
      {
        category: "재산",
        document: "부동산 등기사항전부증명서",
        checkPoint: "교지·교사·수익용 재산 권리관계",
      },
      {
        category: "시설",
        document: "교지·교사 확보계획서",
        checkPoint: "학교 종류별 시설 기준",
      },
      {
        category: "시설",
        document: "건축계획서 또는 도면",
        checkPoint: "교실, 강당, 실습실 등",
      },
      {
        category: "교육",
        document: "교육과정 운영계획서",
        checkPoint: "학과, 정원, 교원, 교육과정",
      },
      {
        category: "인력",
        document: "교원 확보계획서",
        checkPoint: "교원 수급 가능성",
      },
      {
        category: "예산",
        document: "개교 전후 수지예산서",
        checkPoint: "운영비, 인건비, 시설비",
      },
      {
        category: "수요",
        document: "학생 수요 및 지역 교육수요 자료",
        checkPoint: "설립 필요성 입증",
      },
    ],
  },
  {
    id: "culture",
    badge: "Culture & Museum Foundation",
    title: "문화재단·박물관 재단 설립 제출서류 체크리스트",
    description:
      "문화재단과 박물관 재단은 소장품의 공익성, 전시공간, 보존관리, 교육·연구사업, 디지털 아카이브 계획이 중요합니다.",
    rows: [
      {
        category: "기본",
        document: "문화재단 설립허가 신청서",
        checkPoint: "문화·예술·박물관 목적 명확성",
      },
      {
        category: "기본",
        document: "설립취지서",
        checkPoint: "문화유산 보존, 전시, 교육, 연구 목적",
      },
      {
        category: "기본",
        document: "정관",
        checkPoint: "목적사업, 재산, 임원, 이사회, 해산",
      },
      {
        category: "회의",
        document: "발기인 회의록 또는 창립총회 의사록",
        checkPoint: "설립 결의, 정관 승인, 임원 선임",
      },
      {
        category: "인적",
        document: "발기인 명부",
        checkPoint: "문화예술 관련성",
      },
      {
        category: "인적",
        document: "임원 명부",
        checkPoint: "문화·회계·법률·운영 전문성",
      },
      {
        category: "인적",
        document: "임원 취임승낙서",
        checkPoint: "취임 의사 확인",
      },
      {
        category: "인적",
        document: "임원 이력서",
        checkPoint: "관련 경력 확인",
      },
      {
        category: "재산",
        document: "출연재산 목록",
        checkPoint: "현금, 부동산, 소장품, 저작권 등",
      },
      {
        category: "재산",
        document: "출연확인서",
        checkPoint: "출연 확정성",
      },
      {
        category: "재산",
        document: "잔고증명서",
        checkPoint: "운영재원 확보",
      },
      {
        category: "재산",
        document: "소장품 목록",
        checkPoint: "작품명, 작가, 연대, 크기, 사진",
      },
      {
        category: "재산",
        document: "감정평가서 또는 진위자료",
        checkPoint: "미술품·유물 등 객관성",
      },
      {
        category: "시설",
        document: "전시공간 확보자료",
        checkPoint: "임대차계약서, 사용승낙서",
      },
      {
        category: "시설",
        document: "수장고·보존시설 계획",
        checkPoint: "보존관리 가능성",
      },
      {
        category: "사업",
        document: "전시·교육·연구 사업계획서",
        checkPoint: "시민 공개성, 공익성",
      },
      {
        category: "예산",
        document: "수지예산서",
        checkPoint: "전시비, 보존비, 인건비, 운영비",
      },
      {
        category: "운영",
        document: "소장품 관리규정",
        checkPoint: "취득, 보존, 대여, 처분 기준",
      },
      {
        category: "공시",
        document: "홈페이지·아카이브 계획",
        checkPoint: "대외 공개 및 기록 체계",
      },
    ],
  },
  {
    id: "association",
    badge: "Association",
    title: "사단법인 설립 제출서류 체크리스트",
    description:
      "사단법인은 회원 중심 법인이므로 창립총회, 회원명부, 회비규정, 총회·이사회 구조가 설립 심사의 핵심입니다.",
    rows: [
      {
        category: "기본",
        document: "사단법인 설립허가 신청서",
        checkPoint: "목적, 명칭, 소재지, 대표자",
      },
      {
        category: "기본",
        document: "설립취지서",
        checkPoint: "법인 설립 필요성, 공익성",
      },
      {
        category: "기본",
        document: "정관",
        checkPoint: "회원, 총회, 이사회, 회계, 해산",
      },
      {
        category: "회의",
        document: "창립총회 의사록",
        checkPoint: "설립 결의, 정관 승인, 임원 선임",
      },
      {
        category: "회의",
        document: "발기인 회의록",
        checkPoint: "창립총회 전 준비 절차",
      },
      {
        category: "인적",
        document: "발기인 명부",
        checkPoint: "발기인 자격 및 날인",
      },
      {
        category: "인적",
        document: "회원 명부",
        checkPoint: "회원 수, 자격, 대표성",
      },
      {
        category: "인적",
        document: "임원 명부",
        checkPoint: "이사·감사 구성",
      },
      {
        category: "인적",
        document: "임원 취임승낙서",
        checkPoint: "취임 의사 확인",
      },
      {
        category: "인적",
        document: "임원 이력서",
        checkPoint: "목적사업 관련 전문성",
      },
      {
        category: "인적",
        document: "임원 결격사유 확인서",
        checkPoint: "법령상 결격 여부",
      },
      {
        category: "재산",
        document: "재산목록",
        checkPoint: "회비, 기금, 후원금 등",
      },
      {
        category: "재산",
        document: "금융기관 잔고증명서",
        checkPoint: "초기 운영재원 확인",
      },
      {
        category: "사업",
        document: "사업계획서",
        checkPoint: "회원활동, 목적사업, 일정",
      },
      {
        category: "예산",
        document: "수지예산서",
        checkPoint: "회비수입, 후원금, 사업비",
      },
      {
        category: "사무소",
        document: "임대차계약서 또는 사용승낙서",
        checkPoint: "주사무소 확보",
      },
      {
        category: "운영",
        document: "회원가입 신청서 양식",
        checkPoint: "회원 관리 체계",
      },
      {
        category: "운영",
        document: "회비 규정",
        checkPoint: "회비 금액, 납부 방식",
      },
    ],
  },
  {
    id: "credit-union",
    badge: "Credit Union",
    title: "신용협동조합 설립 제출서류 체크리스트",
    description:
      "신용협동조합은 금융기관 성격을 가지므로 공동유대, 출자금, 조합원 수, 내부통제, 전산 및 리스크관리 계획이 중요합니다.",
    rows: [
      {
        category: "기본",
        document: "신용협동조합 설립인가 신청서",
        checkPoint: "공동유대, 명칭, 소재지",
      },
      {
        category: "기본",
        document: "정관",
        checkPoint: "조합원, 출자, 사업, 총회, 이사회",
      },
      {
        category: "회의",
        document: "발기인 회의록",
        checkPoint: "설립 준비, 정관안, 창립총회 소집",
      },
      {
        category: "회의",
        document: "창립총회 의사록",
        checkPoint: "정관 승인, 임원 선출, 사업계획 승인",
      },
      {
        category: "인적",
        document: "발기인 명부",
        checkPoint: "공동유대 소속 30인 이상 여부 등",
      },
      {
        category: "인적",
        document: "설립동의자 명부",
        checkPoint: "조합원 수, 공동유대 적합성",
      },
      {
        category: "인적",
        document: "조합원 가입신청서",
        checkPoint: "가입 의사와 출자 약정",
      },
      {
        category: "인적",
        document: "임원 명부",
        checkPoint: "이사장, 이사, 감사 구성",
      },
      {
        category: "인적",
        document: "임원 이력서",
        checkPoint: "금융·회계·조합 운영 역량",
      },
      {
        category: "인적",
        document: "임원 결격사유 확인서",
        checkPoint: "금융 관련 결격 여부",
      },
      {
        category: "재산",
        document: "출자금 납입 증명서",
        checkPoint: "실제 출자금 납입 여부",
      },
      {
        category: "재산",
        document: "금융기관 잔고증명서",
        checkPoint: "설립 자금 예치 여부",
      },
      {
        category: "사업",
        document: "사업계획서",
        checkPoint: "수신, 여신, 조합원 서비스, 리스크관리",
      },
      {
        category: "예산",
        document: "수지예산서",
        checkPoint: "수익·비용·손익 전망",
      },
      {
        category: "공동유대",
        document: "공동유대 입증자료",
        checkPoint: "지역, 직장, 단체 등 범위 명확성",
      },
      {
        category: "운영",
        document: "내부통제계획서",
        checkPoint: "여신심사, 감사, 회계, 전산관리",
      },
      {
        category: "운영",
        document: "임직원 확보계획서",
        checkPoint: "금융업무 수행 가능성",
      },
      {
        category: "사무소",
        document: "사무소 확보자료",
        checkPoint: "영업점 위치, 임대차계약",
      },
      {
        category: "전산",
        document: "전산시스템 운영계획",
        checkPoint: "금융거래 관리 가능성",
      },
    ],
  },
  {
    id: "social-enterprise",
    badge: "Social Enterprise",
    title: "사회적기업 설립·인증 제출서류 체크리스트",
    description:
      "사회적기업은 법인 설립서류와 인증 신청서류를 나누어 준비해야 하며, 실제 운영 증빙이 핵심입니다.",
    rows: [
      {
        category: "법인설립",
        document: "법인설립 신청서 또는 등기신청서",
        checkPoint: "법인 형태별 양식",
      },
      {
        category: "법인설립",
        document: "정관",
        checkPoint: "사회적 목적, 이윤 재투자, 의사결정구조 반영",
      },
      {
        category: "법인설립",
        document: "창립총회 의사록",
        checkPoint: "설립 결의, 정관 승인, 임원 선임",
      },
      {
        category: "법인설립",
        document: "발기인 또는 주주 명부",
        checkPoint: "출자자 구성",
      },
      {
        category: "법인설립",
        document: "임원 명부 및 취임승낙서",
        checkPoint: "대표, 이사, 감사",
      },
      {
        category: "법인설립",
        document: "출자금 납입증명서 또는 잔고증명서",
        checkPoint: "자본금 납입 확인",
      },
      {
        category: "법인설립",
        document: "사업계획서",
        checkPoint: "사회적 목적과 수익모델 연결",
      },
      {
        category: "인증",
        document: "사회적기업 인증 신청서",
        checkPoint: "신청 유형, 법인 정보",
      },
      {
        category: "인증",
        document: "사회적기업 사실확인서",
        checkPoint: "목적 유형별 기준 충족",
      },
      {
        category: "인증",
        document: "법인 등기사항전부증명서",
        checkPoint: "법적 조직형태",
      },
      {
        category: "인증",
        document: "정관 사본",
        checkPoint: "공증 여부, 필수 조항 반영",
      },
      {
        category: "인증",
        document: "유급근로자 명부",
        checkPoint: "1인 이상 유급근로자",
      },
      {
        category: "인증",
        document: "근로계약서, 급여대장, 4대 보험 확인서류",
        checkPoint: "고용 실체 확인",
      },
      {
        category: "인증",
        document: "취약계층 고용 증빙서류",
        checkPoint: "유형별 증빙자료",
      },
      {
        category: "인증",
        document: "사회서비스 제공 확인서류",
        checkPoint: "수혜자, 제공 실적",
      },
      {
        category: "인증",
        document: "재무제표 및 계정별원장",
        checkPoint: "영업수익 요건 확인",
      },
      {
        category: "인증",
        document: "이사회 또는 운영위원회 회의록",
        checkPoint: "이해관계자 참여 구조",
      },
      {
        category: "인증",
        document: "개인정보 수집·이용·제공 동의서",
        checkPoint: "신청 필수 동의",
      },
    ],
  },
  {
    id: "corporation",
    badge: "For-Profit Corporation",
    title: "영리법인 설립 제출서류 체크리스트",
    description:
      "영리법인은 설립등기와 사업자등록이 중심이며, 인허가 업종은 별도 허가·신고서류를 함께 검토해야 합니다.",
    rows: [
      {
        category: "기본",
        document: "정관",
        checkPoint: "목적, 상호, 본점, 발행주식, 기관구성",
      },
      {
        category: "인적",
        document: "발기인 명부",
        checkPoint: "주식 인수 및 설립 참여자",
      },
      {
        category: "인적",
        document: "주주명부",
        checkPoint: "주주, 주식 수, 지분율",
      },
      {
        category: "인적",
        document: "임원 취임승낙서",
        checkPoint: "대표이사, 이사, 감사",
      },
      {
        category: "인적",
        document: "임원 인감증명서",
        checkPoint: "등기 필요서류",
      },
      {
        category: "인적",
        document: "주민등록등본 또는 초본",
        checkPoint: "임원 주소 확인",
      },
      {
        category: "재산",
        document: "주식인수증",
        checkPoint: "발기인 또는 주주의 주식 인수",
      },
      {
        category: "재산",
        document: "잔고증명서",
        checkPoint: "자본금 납입 확인",
      },
      {
        category: "회의",
        document: "발기인총회 의사록",
        checkPoint: "임원 선임, 정관 승인",
      },
      {
        category: "회의",
        document: "이사회 의사록",
        checkPoint: "대표이사 선임 등",
      },
      {
        category: "등기",
        document: "법인설립등기 신청서",
        checkPoint: "관할 등기소 제출",
      },
      {
        category: "등기",
        document: "법인 인감신고서",
        checkPoint: "법인인감 등록",
      },
      {
        category: "세무",
        document: "법인설립신고 및 사업자등록 신청서",
        checkPoint: "관할 세무서 신고",
      },
      {
        category: "사무소",
        document: "임대차계약서",
        checkPoint: "본점 소재지 입증",
      },
      {
        category: "인허가",
        document: "업종별 인허가 서류",
        checkPoint: "의료, 금융, 교육, 폐기물 등 특수업종",
      },
    ],
  },
];

const anchorButtons = checklistSections.map((section) => ({
  id: section.id,
  title: section.title.replace(" 제출서류 체크리스트", ""),
}));

function getRowKey(sectionId: string, rowIndex: number): string {
  return `${sectionId}-${rowIndex}`;
}

function getReadinessText(percent: number): string {
  if (percent >= 90) return "제출 전 최종 점검 단계";
  if (percent >= 70) return "주무관청 사전협의 가능 단계";
  if (percent >= 40) return "기초 서류 준비 단계";
  if (percent > 0) return "준비 초기 단계";
  return "미체크 상태";
}

function getReadinessClass(percent: number): string {
  if (percent >= 90) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (percent >= 70) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (percent >= 40) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (percent > 0) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function getConsultingSummaryTitle(totalPercent: number): string {
  if (totalPercent >= 90) return "제출 전 최종 점검 상담 요청";
  if (totalPercent >= 70) return "주무관청 사전협의 준비 상담 요청";
  if (totalPercent >= 40) return "기초 제출서류 보완 상담 요청";
  if (totalPercent > 0) return "설립 초기 방향 설정 상담 요청";
  return "법인설립 제출서류 체크리스트 상담 요청";
}

export default function LegalEntityAnchorChecklistSections() {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [form, setForm] = useState<InquiryFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const totalRows = useMemo(
    () =>
      checklistSections.reduce(
        (sum, section) => sum + section.rows.length,
        0
      ),
    []
  );

  const totalChecked = checkedKeys.length;

  const totalPercent =
    totalRows > 0 ? Math.round((totalChecked / totalRows) * 100) : 0;

  function isChecked(sectionId: string, rowIndex: number): boolean {
    return checkedKeys.includes(getRowKey(sectionId, rowIndex));
  }

  function toggleRow(sectionId: string, rowIndex: number): void {
    const key = getRowKey(sectionId, rowIndex);

    setCheckedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  }

  function resetSection(sectionId: string): void {
    setCheckedKeys((prev) =>
      prev.filter((key) => !key.startsWith(`${sectionId}-`))
    );
  }

  function resetAll(): void {
    setCheckedKeys([]);
  }

  function getSectionCheckedCount(section: ChecklistSection): number {
    return section.rows.filter((_, rowIndex) =>
      isChecked(section.id, rowIndex)
    ).length;
  }

  function getSectionPercent(section: ChecklistSection): number {
    const checkedCount = getSectionCheckedCount(section);

    return section.rows.length > 0
      ? Math.round((checkedCount / section.rows.length) * 100)
      : 0;
  }

  function getSelectedSectionSummaries(): SelectedSectionSummary[] {
    return checklistSections
      .map((section) => {
        const checkedRows = section.rows.filter((_, rowIndex) =>
          isChecked(section.id, rowIndex)
        );
        const checkedCount = checkedRows.length;
        const totalCount = section.rows.length;
        const percent =
          totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

        return {
          sectionTitle: section.title,
          checkedCount,
          totalCount,
          percent,
          checkedRows,
        };
      })
      .filter((summary) => summary.checkedCount > 0);
  }

  function buildLegalEntityChecklistMessage(): string {
    const summaries = getSelectedSectionSummaries();

    const selectedDetail =
      summaries.length > 0
        ? summaries
            .map((summary) => {
              const checkedDocuments = summary.checkedRows
                .map(
                  (row) =>
                    `  - [${row.category}] ${row.document}: ${row.checkPoint}`
                )
                .join("\n");

              return [
                `■ ${summary.sectionTitle}`,
                `체크 현황: ${summary.checkedCount}/${summary.totalCount}`,
                `준비도: ${summary.percent}%`,
                `준비 단계: ${getReadinessText(summary.percent)}`,
                "체크한 제출서류:",
                checkedDocuments,
              ].join("\n");
            })
            .join("\n\n")
        : "아직 체크한 제출서류 항목이 없습니다.";

    return [
      "[법인별 제출서류 체크리스트 결과]",
      "",
      `상담 유형: ${getConsultingSummaryTitle(totalPercent)}`,
      `전체 체크 현황: ${totalChecked}/${totalRows}`,
      `전체 준비도: ${totalPercent}%`,
      `전체 준비 단계: ${getReadinessText(totalPercent)}`,
      "",
      "법인별 체크 결과:",
      selectedDetail,
      "",
      "상담 요청:",
      "위 제출서류 체크 결과를 기준으로 법인 유형별 설립 가능성, 주무관청 사전협의 방향, 부족서류 보완 범위, 정관·사업계획서·재산목록 준비 순서를 상담받고 싶습니다.",
    ].join("\n");
  }

  function handleConsultingWithChecklistResult(): void {
    const message = buildLegalEntityChecklistMessage();

    setForm((prev) => ({
      ...prev,
      message,
    }));

    try {
      window.sessionStorage.setItem(CHECKLIST_STORAGE_KEY, message);
    } catch {
      // 브라우저 저장소 접근이 제한된 경우에도 페이지 이동은 정상 처리합니다.
    }

    window.setTimeout(() => {
      document
        .getElementById("legal-entity-checklist-inquiry")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  async function handleChecklistInquirySubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    if (isSubmitting) return;

    const message = form.message.trim()
      ? form.message
      : buildLegalEntityChecklistMessage();

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !message.trim()
    ) {
      alert("성명, 연락처, 이메일, 문의 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await submitInquiry(
        {
          ...form,
          message,
        },
        "public-interest-foundation/legal-entity-checklist",
        "제출서류 체크리스트"
      );

      const rawText = await response.text();
      let result: { ok?: boolean; message?: string; detail?: string } | null =
        null;

      if (rawText.trim()) {
        try {
          result = JSON.parse(rawText) as {
            ok?: boolean;
            message?: string;
            detail?: string;
          };
        } catch {
          result = null;
        }
      }

      if (!response.ok || result?.ok === false) {
        alert(
          result?.detail
            ? `${result.message ?? "문의 저장 실패"}\n\n${result.detail}`
            : result?.message ??
                `문의 저장 중 오류가 발생했습니다.\n\n상태코드: ${response.status}\n응답내용: ${
                  rawText || "(빈 응답)"
                }`
        );
        return;
      }

      setForm({
        organization: "",
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      alert("제출서류 체크리스트 상담 신청이 정상적으로 접수되었습니다.");
    } catch (error) {
      alert(
        error instanceof Error
          ? `문의 전송 중 오류가 발생했습니다.\n\n${error.message}`
          : "문의 전송 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="legal-entity-checklist"
      className="bg-white px-6 py-20 md:px-10 md:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
            Legal Entity Checklist
          </div>

          <h2 className="mt-4 text-3xl font-bold text-[#0B1F35] md:text-5xl">
            각 법인별 제출서류 체크리스트
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg md:leading-9">
            법인 유형에 따라 주무관청, 허가 기준, 제출서류, 심사 쟁점이
            달라집니다. 아래 항목을 체크하면 상담 신청 시 문의내용에 체크
            결과가 자동으로 전달됩니다.
          </p>
        </div>

        <div className="mt-10 rounded-[32px] border border-slate-200 bg-[#081A2F] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#E5C996]">
                Total Progress
              </div>
              <h3 className="mt-3 text-2xl font-bold md:text-3xl">
                전체 제출서류 준비도
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">
                전체 {totalRows}개 항목 중 {totalChecked}개 항목을
                체크했습니다. 상담 신청 시 현재 체크 결과가 문의내용에 자동
                반영됩니다.
              </p>
            </div>

            <div className="min-w-[220px] rounded-[24px] bg-white/8 p-5">
              <div className="text-sm text-slate-300">전체 진행률</div>
              <div className="mt-2 text-4xl font-bold">{totalPercent}%</div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#E5C996] transition-all duration-500"
                  style={{ width: `${totalPercent}%` }}
                />
              </div>
              <div className="mt-3 text-xs font-semibold text-[#E5C996]">
                {getReadinessText(totalPercent)}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/12"
            >
              전체 체크 초기화
            </button>

            <button
              type="button"
              onClick={handleConsultingWithChecklistResult}
              className="inline-flex items-center justify-center rounded-full bg-[#E5C996] px-5 py-3 text-sm font-semibold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_18px_40px_rgba(229,201,150,0.24)]"
            >
              체크 결과로 상담 신청하기
            </button>
          </div>
        </div>

        <div className="sticky top-[84px] z-30 mt-12 rounded-[28px] border border-slate-200 bg-white/92 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {anchorButtons.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 rounded-full border border-slate-300 bg-[#FCFBF8] px-4 py-2 text-sm font-semibold text-[#0B1F35] transition-all duration-300 hover:border-[#C9A96B] hover:bg-[#FBF5EA]"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-14 space-y-14">
          {checklistSections.map((section, index) => {
            const sectionCheckedCount = getSectionCheckedCount(section);
            const sectionPercent = getSectionPercent(section);

            return (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-36 overflow-hidden rounded-[36px] border border-slate-200 bg-[#FCFBF8] shadow-[0_14px_38px_rgba(15,23,42,0.06)]"
              >
                <div className="grid gap-0 lg:grid-cols-[0.35fr_0.65fr]">
                  <div className="bg-[#081A2F] p-6 text-white md:p-8">
                    <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E5C996]">
                      {section.badge}
                    </div>

                    <div className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-lg font-bold text-[#E5C996]">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <h3 className="mt-6 text-2xl font-bold leading-[1.35] md:text-3xl">
                      {section.title}
                    </h3>

                    <p className="mt-5 text-sm leading-8 text-slate-300 md:text-base">
                      {section.description}
                    </p>

                    <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                      총 {section.rows.length}개 제출서류 항목 중{" "}
                      <span className="font-bold text-[#E5C996]">
                        {sectionCheckedCount}개
                      </span>
                      를 체크했습니다.
                    </div>

                    <div className="mt-5 rounded-[22px] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-semibold text-slate-300">
                          법인별 준비도
                        </div>
                        <div className="text-2xl font-bold text-[#E5C996]">
                          {sectionPercent}%
                        </div>
                      </div>

                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[#E5C996] transition-all duration-500"
                          style={{ width: `${sectionPercent}%` }}
                        />
                      </div>

                      <div
                        className={`mt-4 rounded-full border px-4 py-2 text-center text-sm font-bold ${getReadinessClass(
                          sectionPercent
                        )}`}
                      >
                        {getReadinessText(sectionPercent)}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <button
                        type="button"
                        onClick={() => resetSection(section.id)}
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/12"
                      >
                        이 법인 체크 초기화
                      </button>

                      <button
                        type="button"
                        onClick={handleConsultingWithChecklistResult}
                        className="inline-flex items-center justify-center rounded-full bg-[#E5C996] px-5 py-3 text-sm font-semibold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_18px_40px_rgba(229,201,150,0.24)]"
                      >
                        체크 결과로 상담 신청하기
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-4 md:p-6">
                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                      <div className="grid grid-cols-[72px_1fr_1.2fr] bg-[#F8F6F1] text-sm font-bold text-[#0B1F35] md:grid-cols-[100px_1fr_1.25fr]">
                        <div className="border-r border-slate-200 px-3 py-4 text-center">
                          체크
                        </div>
                        <div className="border-r border-slate-200 px-4 py-4">
                          제출서류
                        </div>
                        <div className="px-4 py-4">핵심 확인사항</div>
                      </div>

                      {section.rows.map((row, rowIndex) => {
                        const checked = isChecked(section.id, rowIndex);

                        return (
                          <button
                            key={`${section.id}-${row.document}-${rowIndex}`}
                            type="button"
                            onClick={() => toggleRow(section.id, rowIndex)}
                            className={`grid w-full grid-cols-[72px_1fr_1.2fr] border-t border-slate-200 text-left text-sm transition-all duration-300 md:grid-cols-[100px_1fr_1.25fr] ${
                              checked
                                ? "bg-[#FBF5EA]"
                                : "bg-white hover:bg-[#FCFBF8]"
                            }`}
                          >
                            <div className="flex items-center justify-center border-r border-slate-200 px-3 py-4">
                              <span
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-bold transition-all duration-300 ${
                                  checked
                                    ? "border-[#C9A96B] bg-[#C9A96B] text-white"
                                    : "border-slate-300 bg-white text-slate-400"
                                }`}
                              >
                                {checked ? "✓" : "□"}
                              </span>
                            </div>

                            <div className="border-r border-slate-200 px-4 py-4">
                              <div
                                className={`mb-2 inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                                  checked
                                    ? "bg-white text-[#C9A96B]"
                                    : "bg-[#F8F6F1] text-[#C9A96B]"
                                }`}
                              >
                                {row.category}
                              </div>
                              <div
                                className={`font-bold leading-7 ${
                                  checked
                                    ? "text-[#081A2F]"
                                    : "text-[#0B1F35]"
                                }`}
                              >
                                {row.document}
                              </div>
                            </div>

                            <div
                              className={`px-4 py-4 leading-7 ${
                                checked
                                  ? "font-medium text-[#0B1F35]"
                                  : "text-slate-700"
                              }`}
                            >
                              {row.checkPoint}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <a
                        href="#legal-entity-checklist"
                        className="inline-flex items-center justify-center rounded-full bg-[#081A2F] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,31,53,0.14)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_45px_rgba(11,31,53,0.20)]"
                      >
                        전체 준비도로 이동하기
                      </a>

                      <button
                        type="button"
                        onClick={handleConsultingWithChecklistResult}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50"
                      >
                        체크 결과로 상담 신청하기
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div
          id="legal-entity-checklist-inquiry"
          className="scroll-mt-36 pt-20"
        >
          <div className="mx-auto max-w-4xl text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
              Checklist Consulting
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#0B1F35] md:text-5xl">
              제출서류 체크리스트 상담 신청
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg md:leading-9">
              체크 결과로 상담 신청하기를 누르면 선택한 제출서류 결과가 아래
              문의내용에 자동 입력됩니다.
            </p>
          </div>

          <form
            onSubmit={handleChecklistInquirySubmit}
            className="mt-14 rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] focus-within:-translate-y-1 focus-within:border-[#0B1F35]/20 focus-within:shadow-[0_24px_60px_rgba(15,23,42,0.10)] md:p-10"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                value={form.organization}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, organization: value }))
                }
                placeholder="기관명"
              />
              <FormInput
                value={form.name}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, name: value }))
                }
                placeholder="성명"
              />
              <FormInput
                value={form.phone}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, phone: value }))
                }
                placeholder="연락처"
              />
              <FormInput
                value={form.email}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, email: value }))
                }
                placeholder="이메일"
                type="email"
              />
            </div>

            <FormTextarea
              value={form.message}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, message: value }))
              }
              placeholder="체크 결과로 상담 신청하기를 누르면 선택한 제출서류 결과가 자동 입력됩니다."
              className="mt-4"
              rows={10}
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleConsultingWithChecklistResult}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50 md:px-7 md:py-4 md:text-base"
              >
                체크 결과 다시 반영하기
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center rounded-full bg-[#081A2F] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,31,53,0.14)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_45px_rgba(11,31,53,0.20)] md:px-7 md:py-4 md:text-base ${
                  isSubmitting ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {isSubmitting ? "접수 중..." : "상담 신청하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
