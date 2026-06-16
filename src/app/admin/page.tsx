"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

const COLORS = ["#FF6B00", "#F5C842", "#1A6B3A", "#4A90D9", "#A855F7"];

interface KPIData {
  total_visits: number;
  unique_visitors: number;
  test_starts: number;
  test_completes: number;
  cardnews_views: number;
  feedback_count: number;
  avg_satisfaction: number;
}

interface HourlyData {
  hour: string;
  count: number;
}

interface ResultDist {
  name: string;
  value: number;
}

interface CardStat {
  page: string;
  views: number;
  avg_duration: number;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [kpi, setKpi] = useState<KPIData | null>(null);
  const [hourly, setHourly] = useState<HourlyData[]>([]);
  const [resultDist, setResultDist] = useState<ResultDist[]>([]);
  const [cardStats, setCardStats] = useState<CardStat[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "admin1234") {
      setAuthed(true);
      loadData();
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // KPI data
      const { count: totalVisits } = await supabase.from("visits").select("*", { count: "exact", head: true });
      const { data: uniqueData } = await supabase.from("visits").select("visitor_id");
      const uniqueVisitors = new Set(uniqueData?.map((d) => d.visitor_id)).size;
      const { count: testStarts } = await supabase.from("visits").select("*", { count: "exact", head: true }).not("test_start_time", "is", null);
      const { count: testCompletes } = await supabase.from("visits").select("*", { count: "exact", head: true }).not("test_complete_time", "is", null);
      const { count: cardviewCount } = await supabase.from("visits").select("*", { count: "exact", head: true }).eq("cardnews_view", true);
      const { data: fbData } = await supabase.from("feedbacks").select("score");
      const goodCount = fbData?.filter((f) => f.score === "good").length || 0;
      const avgSat = fbData?.length ? Math.round((goodCount / fbData.length) * 100) : 0;

      setKpi({
        total_visits: totalVisits || 0,
        unique_visitors: uniqueVisitors,
        test_starts: testStarts || 0,
        test_completes: testCompletes || 0,
        cardnews_views: cardviewCount || 0,
        feedback_count: fbData?.length || 0,
        avg_satisfaction: avgSat,
      });

      // Hourly data (last 24h)
      const { data: hourlyData } = await supabase
        .from("visits")
        .select("visit_time")
        .gte("visit_time", new Date(Date.now() - 86400000).toISOString());

      const hourCounts: Record<string, number> = {};
      hourlyData?.forEach((v) => {
        const h = new Date(v.visit_time).getHours();
        const key = `${h}시`;
        hourCounts[key] = (hourCounts[key] || 0) + 1;
      });
      setHourly(Object.entries(hourCounts).map(([hour, count]) => ({ hour, count })));

      // Result distribution
      const { data: resultData } = await supabase.from("visits").select("result_type").not("result_type", "is", null);
      const resultCounts: Record<string, number> = {};
      resultData?.forEach((r) => {
        resultCounts[r.result_type] = (resultCounts[r.result_type] || 0) + 1;
      });
      setResultDist(Object.entries(resultCounts).map(([name, value]) => ({ name, value })));

      // Card news stats
      const { data: cardData } = await supabase.from("cardnews_views").select("page, duration");
      const pageStats: Record<number, { views: number; totalDuration: number }> = {};
      cardData?.forEach((c) => {
        if (!pageStats[c.page]) pageStats[c.page] = { views: 0, totalDuration: 0 };
        pageStats[c.page].views++;
        pageStats[c.page].totalDuration += c.duration;
      });
      setCardStats(
        Object.entries(pageStats).map(([page, stat]) => ({
          page: `카드 ${page}`,
          views: stat.views,
          avg_duration: Math.round(stat.totalDuration / stat.views),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const funnelData = kpi
    ? [
        { name: "방문", value: kpi.total_visits, fill: "#FF6B00" },
        { name: "카드뉴스", value: kpi.cardnews_views, fill: "#4A90D9" },
        { name: "만족도", value: kpi.feedback_count, fill: "#A855F7" },
      ]
    : [];

  if (!authed) {
    return (
      <div className="min-h-screen bg-hw-dark flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">한화생명 볼파크 직관 유형 테스트</p>
          </div>
          <div className="bg-hw-gray/50 border border-white/10 rounded-2xl p-6">
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm mb-4 outline-none focus:border-hw-orange/50"
            />
            <button onClick={handleLogin} className="btn-primary w-full py-3 rounded-xl font-bold">
              로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-hw-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-hw-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/40 text-sm">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hw-dark text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-hw-orange">ADMIN DASHBOARD</h1>
          <p className="text-white/40 text-sm">한화생명 볼파크 직관 유형 테스트</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/30 transition-all"
        >
          🔄 새로고침
        </button>
      </div>

      {/* KPI Cards */}
      {kpi && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "총 방문자", value: kpi.total_visits.toLocaleString(), unit: "명", color: "#FF6B00" },
            { label: "순 방문자", value: kpi.unique_visitors.toLocaleString(), unit: "명", color: "#F5C842" },
            { label: "카드뉴스 진입률", value: kpi.total_visits ? Math.round((kpi.cardnews_views / kpi.total_visits) * 100) : 0, unit: "%", color: "#4A90D9" },
            { label: "카드뉴스 조회", value: kpi.cardnews_views.toLocaleString(), unit: "건", color: "#F5C842" },
            { label: "만족도", value: kpi.avg_satisfaction, unit: "%", color: "#1A6B3A" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-hw-gray/40 border border-white/5 rounded-2xl p-4"
              style={{ borderTopColor: `${item.color}50` }}
            >
              <div className="text-white/40 text-xs mb-1">{item.label}</div>
              <div className="font-display text-3xl" style={{ color: item.color }}>
                {item.value}
                <span className="text-lg ml-1 text-white/40">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hourly visitors */}
        <div className="bg-hw-gray/40 border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider">시간대별 방문자</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourly}>
              <XAxis dataKey="hour" stroke="#ffffff20" tick={{ fill: "#ffffff40", fontSize: 11 }} />
              <YAxis stroke="#ffffff20" tick={{ fill: "#ffffff40", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1E2535", border: "1px solid #FF6B0030", borderRadius: 8, color: "#fff" }} />
              <Line type="monotone" dataKey="count" stroke="#FF6B00" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Result distribution */}
        <div className="bg-hw-gray/40 border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider">유형 분포</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie data={resultDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {resultDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1E2535", border: "none", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {resultDist.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-white/60 truncate">{item.name}</span>
                  <span className="ml-auto text-white font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-hw-gray/40 border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider">전환 퍼널</h3>
          <div className="space-y-2">
            {funnelData.map((item, i) => {
              const pct = funnelData[0].value ? Math.round((item.value / funnelData[0].value) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{item.name}</span>
                    <span style={{ color: item.fill }}>{item.value}명 ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: item.fill }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card news stats */}
        <div className="bg-hw-gray/40 border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider">카드뉴스 체류시간 (초)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cardStats}>
              <XAxis dataKey="page" stroke="#ffffff20" tick={{ fill: "#ffffff40", fontSize: 11 }} />
              <YAxis stroke="#ffffff20" tick={{ fill: "#ffffff40", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1E2535", border: "none", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="avg_duration" fill="#4A90D9" radius={[4, 4, 0, 0]} name="평균 체류(초)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
