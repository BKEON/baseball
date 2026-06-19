import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

const VISITOR_KEY = "hw_visitor_id";
const SESSION_KEY = "hw_session_id";

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export async function trackVisit() {
  const visitor_id = getOrCreateVisitorId();
  const session_id = getOrCreateSessionId();

  const params = new URLSearchParams(window.location.search);

  await supabase.from("visits").insert({
    visitor_id,
    session_id,
    visit_time: new Date().toISOString(),
    device_type: getDeviceType(),
    referrer: document.referrer || "",
    utm_source: params.get("utm_source") || null,
    utm_campaign: params.get("utm_campaign") || null,
  });
}

export async function trackEvent(
  event_type: string,
  event_data?: Record<string, unknown>
) {
  const session_id = getOrCreateSessionId();
  await supabase.from("events").insert({
    session_id,
    event_type,
    event_data: event_data || {},
    occurred_at: new Date().toISOString(),
  });
}

export async function trackTestStart() {
  const session_id = getOrCreateSessionId();
  await supabase
    .from("visits")
    .update({ test_start_time: new Date().toISOString() })
    .eq("session_id", session_id);
  await trackEvent("test_start");
}

export async function trackTestComplete(result_type: string) {
  const session_id = getOrCreateSessionId();
  await supabase
    .from("visits")
    .update({
      test_complete_time: new Date().toISOString(),
      result_type,
    })
    .eq("session_id", session_id);
  await trackEvent("test_complete", { result_type });
}

export async function trackCardNews(page: number, duration: number) {
  const session_id = getOrCreateSessionId();
  await supabase.from("cardnews_views").insert({
    session_id,
    page,
    duration,
    viewed_at: new Date().toISOString(),
  });

  if (page === 1) {
    await supabase
      .from("visits")
      .update({ cardnews_view: true })
      .eq("session_id", session_id);
    await trackEvent("cardnews_enter");
  }
}

export async function trackFeedback(score: "good" | "neutral" | "bad") {
  const session_id = getOrCreateSessionId();
  await supabase.from("feedbacks").insert({
    session_id,
    score,
    submitted_at: new Date().toISOString(),
  });
  await trackEvent("feedback", { score });
}

export async function getVisitorCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .gte("visit_time", today.toISOString());
  return count || 0;
}
