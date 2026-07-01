export interface TestAnswers {
  q1?: string; q2?: string; q3?: string;
  q4?: string; q5?: string; q6?: string;
}

export type ResultType =
  | "열정응원러" | "직관몰입형" | "잔디감성형"
  | "가족피크닉형" | "데이터분석형";

export interface ResultInfo {
  type: ResultType;
  seat: string;
  description: string;
  emoji: string;
  color: string;
  bgGradient: string;
  traits: string[];
  seatZone: "cheering" | "center" | "lawn" | "table" | "aisle";
  seatDetail: string;
  seatZoneLabel: string;
}
