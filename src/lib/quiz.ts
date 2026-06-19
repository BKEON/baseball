import type { TestAnswers, ResultType, ResultInfo } from "@/types";

export const RESULT_INFO: Record<ResultType, ResultInfo> = {
  열정응원러: {
    type: "열정응원러",
    seat: "오렌지석 / 응원단석",
    emoji: "🔥",
    description:
      "소리 지르고 춤추며 스트레스를 푸는 타입! 야구 규칙은 몰라도 응원가 부르는 게 즐거운 진정한 치어리더형. 응원단 바로 앞에서 에너지를 폭발시켜보세요!",
    color: "#FF6B00",
    bgGradient: "from-orange-900 via-red-900 to-hw-dark",
    traits: ["응원가 마스터", "치어리더형", "열정 폭발", "분위기 메이커"],
    seatZone: "cheering",
    seatDetail: "1루 103~104구역 (응원단석)",
    seatZoneLabel: "응원단석",
  },
  직관몰입형: {
    type: "직관몰입형",
    seat: "포수 뒤 지정석",
    emoji: "🎯",
    description:
      "경기 흐름과 선수 플레이를 가까이서 보고 싶은 유형.",
    color: "#F5C842",
    bgGradient: "from-yellow-900 via-amber-900 to-hw-dark",
    traits: ["경기 분석", "선수 집중", "최고의 시야", "진짜 야구팬"],
    seatZone: "center",
    seatDetail: "중앙지정석 100B~100C구역",
    seatZoneLabel: "중앙지정석",
  },
  잔디감성형: {
    type: "잔디감성형",
    seat: "외야 잔디석 / 글램핑존",
    emoji: "🌿",
    description:
      "탁 트인 공간에서 소중한 사람들과 여유로운 시간을 보내고 싶은 야구장 힐링 캠퍼형! 잔디 위에서 돗자리 펴고 바베큐까지 즐기는 피크닉 감성.",
    color: "#1A6B3A",
    bgGradient: "from-green-900 via-emerald-900 to-hw-dark",
    traits: ["피크닉 감성", "힐링 캠퍼", "잔디 위 힐링", "바베큐 파티"],
    seatZone: "lawn",
    seatDetail: "외야 잔디석 500구역 / 바베큐석 / 글램핑존",
    seatZoneLabel: "외야 잔디석",
  },
  가족피크닉형: {
    type: "가족피크닉형",
    seat: "테이블석 / 탁자석",
    emoji: "🍗",
    description:
      "크림새우, 떡볶이, 치킨 등 야구장 시그니처 메뉴 접수가 최우선! 음식을 편하게 두고 먹을 수 있는 테이블석이 최고의 명당인 야구장 맛집 탐방가형.",
    color: "#4A90D9",
    bgGradient: "from-blue-900 via-indigo-900 to-hw-dark",
    traits: ["먹방유튜버", "맛집 탐방", "테이블석 고수", "야구장 미식가"],
    seatZone: "table",
    seatDetail: "중앙 테이블석 100A~100C / 4층 내야 탁자석",
    seatZoneLabel: "테이블석",
  },
  데이터분석형: {
    type: "데이터분석형",
    seat: "외야 통로쪽 좌석",
    emoji: "🚪",
    description:
      "답답하거나 지루한 건 못 참는 효율 중시 타입! 분위기 최고일 때 즐기고, 경기가 처지면 미련 없이 일어나는 낄끼빠빠형. 언제든 이동하기 쉬운 통로쪽 자리가 찰떡!",
    color: "#A855F7",
    bgGradient: "from-purple-900 via-violet-900 to-hw-dark",
    traits: ["효율 최우선", "낄끼빠빠", "탈출 전문가", "자유로운 영혼"],
    seatZone: "aisle",
    seatDetail: "외야 501~502구역 / 복도쪽 통로 인접 좌석",
    seatZoneLabel: "외야 통로쪽",
  },
};

// Score map: answer value -> [열정응원러, 직관몰입형, 잔디감성형, 가족피크닉형, 데이터분석형]
// We repurpose the 5 types: 열정응원러=열정, 직관몰입형=unused, 잔디감성형=가족피크닉, 가족피크닉형=먹방, 데이터분석형=낄끼빠빠

export function calculateResult(answers: TestAnswers): ResultType {
  const scores: Record<ResultType, number> = {
    열정응원러: 0,
    직관몰입형: 0,
    잔디감성형: 0,
    가족피크닉형: 0,
    데이터분석형: 0,
  };

  const map: Record<string, Partial<Record<ResultType, number>>> = {
    // Q1
    "열정응원":    { 열정응원러: 3 },
    "먹방":        { 가족피크닉형: 3 },
    "가족피크닉":  { 잔디감성형: 3 },
    "낄끼빠빠":   { 데이터분석형: 3 },
    // Q2
    "앰프응원":   { 열정응원러: 3 },
    "매점대기":   { 가족피크닉형: 3 },
    "잔디하늘":   { 잔디감성형: 3 },
    "조명설렘":   { 데이터분석형: 3 },
    // Q3
    "서서응원":   { 열정응원러: 3 },
    "먹방흡입":   { 가족피크닉형: 3 },
    "도란도란":   { 잔디감성형: 3 },
    "자유왔다":   { 데이터분석형: 3 },
    // Q4
    "역전응원":   { 열정응원러: 3 },
    "먹는게우선": { 가족피크닉형: 3 },
    "셀카남는건": { 잔디감성형: 3 },
    "지금나가자": { 데이터분석형: 3 },
    // Q5
    "치어리더명당": { 열정응원러: 3 },
    "테이블명당":   { 가족피크닉형: 3 },
    "돗자리명당":   { 잔디감성형: 3 },
    "통로명당":     { 데이터분석형: 3 },
    // Q6
    "연장전가능": { 열정응원러: 3 },
    "다먹을때까지": { 가족피크닉형: 3 },
    "노을여유":   { 잔디감성형: 3 },
    "5이닝OUT":   { 데이터분석형: 3 },
  };

  Object.values(answers).forEach((val) => {
    if (val && map[val]) {
      const pts = map[val];
      (Object.keys(pts) as ResultType[]).forEach((t) => {
        scores[t] += pts[t] ?? 0;
      });
    }
  });

  const sorted = (Object.entries(scores) as [ResultType, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  return sorted[0][0];
}
