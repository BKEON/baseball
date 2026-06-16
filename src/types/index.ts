export interface SessionData {
  visitor_id: string;
  session_id: string;
  visit_time: string;
  device_type: "mobile" | "tablet" | "desktop";
  referrer: string;
  utm_source?: string;
  utm_campaign?: string;
}

export interface TestAnswers {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
}

export type ResultType =
  | "열정응원러"
  | "직관몰입형"
  | "잔디감성형"
  | "가족피크닉형"
  | "데이터분석형";

export interface ResultInfo {
  type: ResultType;
  seat: string;
  description: string;
  emoji: string;
  color: string;
  bgGradient: string;
  traits: string[];
}

export interface CardNewsView {
  session_id: string;
  page: number;
  duration: number;
  viewed_at: string;
}

export interface FeedbackData {
  session_id: string;
  score: "good" | "neutral" | "bad";
  submitted_at: string;
}

export interface AnalyticsEvent {
  session_id: string;
  event_type: string;
  event_data?: Record<string, unknown>;
  occurred_at: string;
}
