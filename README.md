# ⚾ 내 직관 유형 테스트 — 한화생명 볼파크

> 한화생명 볼파크 방문객 대상 참여형 웹 서비스  
> QR → 5문항 테스트 → 관람 유형 + 추천 좌석 → 카드뉴스

---

## 📁 폴더 구조

```
baseball-quiz/
├── src/
│   ├── app/
│   │   ├── page.tsx          # 랜딩 페이지 (/)
│   │   ├── test/page.tsx     # 테스트 페이지 (/test)
│   │   ├── result/page.tsx   # 결과 페이지 (/result)
│   │   ├── cardnews/page.tsx # 카드뉴스 (/cardnews)
│   │   ├── feedback/page.tsx # 피드백 (/feedback)
│   │   ├── admin/page.tsx    # 관리자 대시보드 (/admin)
│   │   ├── layout.tsx        # 루트 레이아웃
│   │   └── globals.css       # 전역 스타일
│   ├── lib/
│   │   ├── supabase.ts       # Supabase 클라이언트
│   │   ├── analytics.ts      # 이벤트 추적
│   │   └── quiz.ts           # 결과 계산 로직
│   └── types/
│       └── index.ts          # TypeScript 타입 정의
├── supabase-schema.sql       # DB 스키마
├── .env.local.example        # 환경변수 예시
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 🚀 빠른 시작

### 1. 프로젝트 클론 & 설치

```bash
git clone https://github.com/your-org/baseball-quiz.git
cd baseball-quiz
npm install
```

### 2. 환경변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 값을 채워주세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

### 3. 로컬 실행

```bash
npm run dev
# → http://localhost:3000
```

---

## 🗄️ Supabase 설정

### 1. 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속 → 새 프로젝트 생성
2. Project URL, anon key, service role key 복사

### 2. DB 스키마 적용

Supabase 대시보드 → SQL Editor → `supabase-schema.sql` 내용 전체 실행

생성되는 테이블:
- `visits` — 방문/세션 기록
- `events` — 이벤트 로그
- `cardnews_views` — 카드뉴스 조회 기록
- `feedbacks` — 만족도 피드백

### 3. RLS 정책 확인

SQL 실행 후 Authentication → Policies에서 정책이 적용되었는지 확인

---

## ☁️ Vercel 배포

### 1. GitHub에 코드 푸시

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/your-org/baseball-quiz.git
git push -u origin main
```

### 2. Vercel 연결

1. [vercel.com](https://vercel.com) 로그인
2. "Add New Project" → GitHub 저장소 선택
3. Framework: **Next.js** 자동 감지됨

### 3. 환경변수 추가

Vercel 프로젝트 Settings → Environment Variables:

| 변수명 | 값 |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | 관리자 비밀번호 |

### 4. 배포

"Deploy" 클릭 → 약 1-2분 후 배포 완료

---

## 📊 관리자 대시보드

URL: `your-domain.com/admin`

### 기능

- **KPI 요약**: 총/순 방문자, 테스트 시작/완료율, 카드뉴스 진입률, 만족도
- **시간대별 방문자** (Line Chart)
- **전환 퍼널** (방문 → 테스트시작 → 완료 → 카드뉴스 → 만족도)
- **유형 분포** (Pie Chart)
- **카드뉴스 체류시간** (Bar Chart)

---

## 🎯 결과 유형 로직

5개 질문 답변 → 가중치 점수 계산:

| 유형 | 추천 좌석 | 주요 특징 |
|------|-----------|-----------|
| 열정응원러 | 응원석 | 응원 분위기 최우선 |
| 직관몰입형 | 포수 뒤 지정석 | 경기 집중 |
| 잔디감성형 | 잔디석 | 감성·인증샷 |
| 가족피크닉형 | 테이블석 | 가족·편안함 |
| 데이터분석형 | 내야 중앙석 | 혼자·조용히 |

---

## 📈 수집 데이터

```
방문 세션당:
├── visitor_id (로컬스토리지 UUID)
├── session_id (세션스토리지 UUID)
├── visit_time
├── device_type (mobile/tablet/desktop)
├── referrer
├── utm_source, utm_campaign
├── test_start_time
├── test_complete_time
├── result_type
└── cardnews_view (boolean)

카드뉴스:
├── session_id
├── page (1-4)
└── duration (초)

피드백:
├── session_id
└── score (good/neutral/bad)
```

---

## 🎨 디자인 시스템

| 색상 | HEX | 용도 |
|------|-----|------|
| hw-orange | #FF6B00 | Primary / CTA |
| hw-dark | #0A0E1A | 배경 |
| hw-navy | #0D1B3E | 보조 배경 |
| hw-gold | #F5C842 | 포인트 |
| hw-gray | #1E2535 | 카드 배경 |

폰트:
- Display: **Bebas Neue** (점수판·타이틀)
- Body: **Noto Sans KR** (본문)

---

## 🔧 QR 코드 설정

QR 접속 시 UTM 파라미터 포함 권장:

```
https://your-domain.com?utm_source=qr&utm_campaign=ballpark_booth_2024
```

이렇게 하면 부스별 QR 성과 측정이 가능합니다.

---

## 📦 기술 스택

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + RLS)
- **Analytics**: 자체 이벤트 로그 (Supabase)
- **Charts**: Recharts
- **배포**: Vercel

---

## 🛠️ 개발 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 실행
npm run lint     # ESLint 검사
```

---

## 📝 라이선스

© 2024 한화생명 볼파크. All rights reserved.
