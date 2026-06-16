import type { TestAnswers, ResultType, ResultInfo } from "@/types";

export const RESULT_INFO: Record<ResultType, ResultInfo> = {
  열정응원러: {
    type: "열정응원러",
    seat: "응원석",
    emoji: "🔥",
    description:
      "응원과 분위기를 가장 중요하게 생각하는 유형. 함성 속에서 에너지를 얻고, 팀과 하나가 되는 순간을 사랑합니다.",
    color: "#FF6B00",
    bgGradient: "from-orange-900 via-red-900 to-hw-dark",
    traits: ["열정적인 응원", "팀 일체감", "함성 에너지", "응원가 마스터"],
  },
  직관몰입형: {
    type: "직관몰입형",
    seat: "포수 뒤 지정석",
    emoji: "🎯",
    description:
      "경기 흐름과 선수 플레이를 가까이서 보고 싶은 유형. 투수의 구질, 타자의 스윙 하나하나를 놓치지 않습니다.",
    color: "#F5C842",
    bgGradient: "from-yellow-900 via-amber-900 to-hw-dark",
    traits: ["경기 분석", "선수 집중", "최고의 시야", "진짜 야구팬"],
  },
  잔디감성형: {
    type: "잔디감성형",
    seat: "잔디석",
    emoji: "🌿",
    description:
      "여유롭고 감성적인 야구장 경험을 선호하는 유형. 잔디 위에 앉아 여유롭게 경기를 즐기며 인생샷을 남깁니다.",
    color: "#1A6B3A",
    bgGradient: "from-green-900 via-emerald-900 to-hw-dark",
    traits: ["감성 인증샷", "여유로운 관람", "잔디 피크닉", "자연 친화"],
  },
  가족피크닉형: {
    type: "가족피크닉형",
    seat: "테이블석",
    emoji: "👨‍👩‍👧‍👦",
    description:
      "가족과 함께 편안하게 관람하는 유형. 경기도 즐기고 맛있는 것도 먹으며 특별한 추억을 만듭니다.",
    color: "#4A90D9",
    bgGradient: "from-blue-900 via-indigo-900 to-hw-dark",
    traits: ["가족 친화", "편안한 관람", "풍성한 먹거리", "추억 만들기"],
  },
  데이터분석형: {
    type: "데이터분석형",
    seat: "내야 중앙석",
    emoji: "📊",
    description:
      "경기 전체 흐름과 전술을 즐기는 유형. 타율, 방어율, 출루율까지 꿰뚫고 있는 진짜 야구 전문가입니다.",
    color: "#A855F7",
    bgGradient: "from-purple-900 via-violet-900 to-hw-dark",
    traits: ["세이버메트릭스", "전술 분석", "넓은 시야", "야구 박사"],
  },
};

export function calculateResult(answers: TestAnswers): ResultType {
  const scores: Record<ResultType, number> = {
    열정응원러: 0,
    직관몰입형: 0,
    잔디감성형: 0,
    가족피크닉형: 0,
    데이터분석형: 0,
  };

  // Q1: 가장 중요한 것
  if (answers.q1 === "응원분위기") scores["열정응원러"] += 3;
  if (answers.q1 === "경기몰입감") scores["직관몰입형"] += 3;
  if (answers.q1 === "편안함") scores["가족피크닉형"] += 3;
  if (answers.q1 === "먹거리") scores["가족피크닉형"] += 2;
  if (answers.q1 === "사진") scores["잔디감성형"] += 3;

  // Q2: 응원 소음
  if (answers.q2 === "클수록좋다") scores["열정응원러"] += 3;
  if (answers.q2 === "적당히좋다") scores["잔디감성형"] += 2;
  if (answers.q2 === "조용한것이좋다") scores["데이터분석형"] += 3;

  // Q3: 동행
  if (answers.q3 === "혼자") scores["데이터분석형"] += 2;
  if (answers.q3 === "친구") scores["열정응원러"] += 2;
  if (answers.q3 === "연인") scores["잔디감성형"] += 3;
  if (answers.q3 === "가족") scores["가족피크닉형"] += 3;

  // Q4: 기대되는 순간
  if (answers.q4 === "홈런") scores["열정응원러"] += 2;
  if (answers.q4 === "응원가") scores["열정응원러"] += 3;
  if (answers.q4 === "투수전") scores["직관몰입형"] += 3;
  if (answers.q4 === "먹거리") scores["가족피크닉형"] += 2;
  if (answers.q4 === "인증샷") scores["잔디감성형"] += 3;

  // Q5: 관람 스타일
  if (answers.q5 === "열정적으로응원") scores["열정응원러"] += 3;
  if (answers.q5 === "경기에집중") scores["직관몰입형"] += 3;
  if (answers.q5 === "편안하게관람") scores["가족피크닉형"] += 2;
  if (answers.q5 === "감성적으로즐김") scores["잔디감성형"] += 3;

  // 데이터분석형 보정
  if (answers.q2 === "조용한것이좋다" && answers.q3 === "혼자") {
    scores["데이터분석형"] += 2;
  }

  const sorted = (Object.entries(scores) as [ResultType, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  return sorted[0][0];
}
