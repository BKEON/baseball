-- ============================================
-- 한화생명 볼파크 직관 유형 테스트 DB 스키마
-- Supabase (PostgreSQL)
-- ============================================

-- 방문 기록 테이블
CREATE TABLE IF NOT EXISTS visits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id      TEXT NOT NULL,
  session_id      TEXT NOT NULL UNIQUE,
  visit_time      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device_type     TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  referrer        TEXT,
  utm_source      TEXT,
  utm_campaign    TEXT,
  test_start_time TIMESTAMPTZ,
  test_complete_time TIMESTAMPTZ,
  result_type     TEXT,
  cardnews_view   BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 이벤트 로그 테이블
CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  event_data  JSONB DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 카드뉴스 조회 테이블
CREATE TABLE IF NOT EXISTS cardnews_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT NOT NULL,
  page        INTEGER NOT NULL CHECK (page BETWEEN 1 AND 10),
  duration    INTEGER NOT NULL DEFAULT 0,  -- seconds
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 피드백 테이블
CREATE TABLE IF NOT EXISTS feedbacks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   TEXT NOT NULL,
  score        TEXT NOT NULL CHECK (score IN ('good', 'neutral', 'bad')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 인덱스
-- ============================================

CREATE INDEX IF NOT EXISTS idx_visits_session ON visits(session_id);
CREATE INDEX IF NOT EXISTS idx_visits_visitor ON visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visits_visit_time ON visits(visit_time);
CREATE INDEX IF NOT EXISTS idx_visits_result_type ON visits(result_type);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_cardnews_session ON cardnews_views(session_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_session ON feedbacks(session_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardnews_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 INSERT 허용 (익명 포함)
CREATE POLICY "Allow anon insert visits" ON visits FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update visits" ON visits FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon insert events" ON events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert cardnews" ON cardnews_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert feedbacks" ON feedbacks FOR INSERT TO anon WITH CHECK (true);

-- 관리자(service role)는 모두 읽기 가능
CREATE POLICY "Allow service read visits" ON visits FOR SELECT TO service_role USING (true);
CREATE POLICY "Allow service read events" ON events FOR SELECT TO service_role USING (true);
CREATE POLICY "Allow service read cardnews" ON cardnews_views FOR SELECT TO service_role USING (true);
CREATE POLICY "Allow service read feedbacks" ON feedbacks FOR SELECT TO service_role USING (true);

-- ============================================
-- 통계 뷰
-- ============================================

-- 일별 방문자 요약
CREATE OR REPLACE VIEW daily_stats AS
SELECT
  DATE_TRUNC('day', visit_time) AS day,
  COUNT(*) AS total_visits,
  COUNT(DISTINCT visitor_id) AS unique_visitors,
  COUNT(test_start_time) AS test_starts,
  COUNT(test_complete_time) AS test_completes,
  COUNT(CASE WHEN cardnews_view THEN 1 END) AS cardnews_views,
  ROUND(100.0 * COUNT(test_complete_time) / NULLIF(COUNT(test_start_time), 0), 1) AS completion_rate
FROM visits
GROUP BY 1
ORDER BY 1 DESC;

-- 유형별 분포
CREATE OR REPLACE VIEW result_distribution AS
SELECT
  result_type,
  COUNT(*) AS count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS percentage
FROM visits
WHERE result_type IS NOT NULL
GROUP BY result_type
ORDER BY count DESC;

-- 카드뉴스 페이지별 통계
CREATE OR REPLACE VIEW cardnews_stats AS
SELECT
  page,
  COUNT(*) AS views,
  ROUND(AVG(duration), 1) AS avg_duration_seconds,
  MAX(duration) AS max_duration
FROM cardnews_views
GROUP BY page
ORDER BY page;

-- 만족도 요약
CREATE OR REPLACE VIEW feedback_summary AS
SELECT
  score,
  COUNT(*) AS count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS percentage
FROM feedbacks
GROUP BY score;
