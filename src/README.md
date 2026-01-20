# 변리사 사무소 업무 현황 대시보드

구글 애널리틱스 스타일의 실시간 데이터 분석 대시보드로, 변리사 사무소의 문의 및 수임 현황을 시각화하여 제공합니다.

![Dashboard Preview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop)

## 📋 프로젝트 개요

이 프로젝트는 **구글 스프레드시트 기반 API**를 활용하여 변리사 사무소의 업무 현황을 실시간으로 모니터링하고 분석할 수 있는 웹 대시보드입니다.

### 주요 특징

- 📊 **실시간 데이터 동기화**: 구글 스프레드시트와 자동 연동
- 📈 **다양한 시각화**: 월별/일별/요일별/시간대별 차트 제공
- 📱 **완전 반응형**: 모바일, 태블릿, 데스크톱 최적화
- 🌓 **다크모드 지원**: 라이트/다크/시스템 테마
- 🔔 **Slack 알림**: 신규 수임 발생 시 자동 알림
- 🔐 **보안 인증**: 이중 인증 시스템

---

## 🏗️ 기술 스택

### Frontend
- **React** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS v4** - 스타일링
- **Recharts** - 차트 시각화
- **Lucide React** - 아이콘
- **date-fns** - 날짜 처리

### Backend
- **Supabase** - 데이터베이스 및 인증
- **Hono** - 서버 프레임워크
- **Google Sheets API** - 데이터 소스
- **Google Apps Script** - 실시간 동기화

### 배포 환경
- **Deno** - 서버 런타임
- **Supabase Edge Functions** - 서버리스 함수

---

## 📊 주요 기능

### 1. 대시보드 홈
- **핵심 지표 카드**: 문의건, 수임건, 수임율
- **실시간 현황**: 금일 문의/수임, 월별 방문상담
- **트래픽 차트**: 최근 10개월 추이
- **접수유형별 분석**: 홈페이지/유선/채팅/기타 비율

### 2. 세부 분석 차트
- **일별 데이터**: 해당 월의 일자별 문의/수임 현황
- **요일별 분석**: 월~일요일 문의/수임 패턴
- **시간대별 분석**: 오전 9시~오후 6시 시간대별 현황
- **변리사별 통계**: 담당 변리사별 상담 현황

### 3. 실시간 동기화
- **배치 동기화**: 초기 10,000건 데이터를 500건씩 20개 배치로 처리
- **자동 동기화**: Google Apps Script로 신규 데이터 자동 추가
- **자동 삭제**: 스프레드시트에서 삭제 시 DB 자동 삭제
- **자동 업데이트**: 30초마다 데이터 새로고침

### 4. Slack 연동
- **수임 알림**: 신규 수임 발생 시 즉시 Slack 메시지 전송
- **변리사 정보**: 담당 변리사, 분야, 수임금액 포함

### 5. 데이터 내보내기
- **CSV 내보내기**: 텍스트 기반 데이터 저장
- **Excel 내보내기**: 스프레드시트 형식 저장
- **PDF 내보내기**: 대시보드 스크린샷 저장

---

## 🗂️ 데이터 구조

### 구글 스프레드시트 (2025상담 시트)

| 열 | 필드명 | 설명 |
|----|--------|------|
| B | date | 문의 접수일 (YYYY-MM-DD) |
| D | receiptType | 접수 유형 (홈페이지/유선/채팅/기타/문의건X) |
| E | inquiryType | 문의 유형 (연락처중복/리마인드CRM 등) |
| F | field | 분야 (특허/상표/디자인 등) |
| H | phone | 전화번호 (중복 제거용) |
| N | attorney | 담당 변리사 |
| Q | isContract | 수임 여부 (TRUE/FALSE) |
| R | contractDate | 수임일 (YYYY-MM-DD) |
| S | contractAmount | 수임금액 |

### 핵심 로직

#### 문의건 카운트
```typescript
// D열이 "문의건X"이고 E열이 "연락처중복" 또는 "리마인드CRM"인 경우
// 같은 달 내 H열(전화번호) 중복 제거
```

#### 수임율 계산
```typescript
// "문의 기준" 수임율
// 12월에 문의가 들어온 건이 1월에 수임되어도 12월 수임건으로 집계
수임율 = (수임건 / 문의건) × 100
```

---

## 🚀 시작하기

### 환경 변수 설정

다음 환경 변수가 필요합니다:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_json
```

### 로그인 정보

기본 로그인 계정:
- **Username**: `admin`
- **Password**: `wjdtjddjs`

---

## 📱 페이지 구조

```
📦 변리사 사무소 대시보드
├── 🏠 홈 (Dashboard)
│   ├── 핵심 지표 카드
│   ├── 실시간 위젯
│   ├── 트래픽 차트
│   ├── 접수유형별 차트
│   ├── 일별 데이터 차트
│   ├── 요일별 차트
│   └── 시간대별 차트
│
├── ⚡ 실시간 (RealtimePage)
│   ├── 금일 문의건
│   ├── 월 수임건
│   ├── 금일 접수 유형별 현황
│   └── 금일 변리사별 상담 현황
│
├── 📋 문의 (InquiryPage)
│   ├── 문의 목록 테이블
│   └── 필터링 기능
│
├── 📝 수임 (ContractPage)
│   ├── 수임 목록 테이블
│   └── 필터링 기능
│
├── 📊 추가지표 (AdditionalMetricsPage)
│   ├── 변리사별 통계
│   └── 분야별 통계
│
├── 📈 세부지표 (DetailedMetricsPage)
│   └── 심화 분석 차트
│
└── 📡 세부매체 데이터 (DetailedMediaPage)
    └── 매체별 상세 분석
```

---

## 🔄 데이터 동기화 플로우

### 1️⃣ 초기 동기화 (배치 처리)

```
구글 스프레드시트 (10,000건)
    ↓
500건씩 20개 배치로 분할
    ↓
순차적으로 Supabase에 저장
    ↓
WORKER_LIMIT 에러 방지
```

### 2️⃣ 실시간 동기화 (Google Apps Script)

```
스프레드시트에 데이터 추가/수정
    ↓
onEdit 트리거 발동
    ↓
Apps Script가 변경 감지
    ↓
Supabase API 호출
    ↓
DB 자동 업데이트
    ↓
(수임인 경우) Slack 알림 전송
```

### 3️⃣ 자동 새로고침 (Frontend)

```
30초마다 자동 실행
    ↓
Supabase에서 최신 데이터 조회
    ↓
상태 업데이트
    ↓
차트 자동 갱신
```

---

## 🎨 UI/UX 특징

### 반응형 디자인
- **모바일**: 1열 레이아웃, 햄버거 메뉴
- **태블릿**: 2열 레이아웃
- **데스크톱**: 3-6열 그리드 레이아웃

### 테마 시스템
- **라이트 모드**: 밝은 배경, 선명한 텍스트
- **다크 모드**: 어두운 배경, 눈의 피로 감소
- **시스템 모드**: OS 설정 자동 감지

### 사용자 경험
- **로딩 상태**: 스켈레톤 UI
- **에러 처리**: 사용자 친화적 메시지
- **스크롤 최적화**: 페이지 전환 시 자동 스크롤 상단 이동
- **필터링**: 변리사/분야/문의유형별 필터

---

## 🛠️ 주요 컴포넌트

### 차트 컴포넌트
- `TrafficChart.tsx` - 트래픽 추이 (Line Chart)
- `DeviceChart.tsx` - 접수유형별 (Pie Chart)
- `WeekdayChart.tsx` - 요일별 (Bar Chart)
- `TopPagesTable.tsx` - 시간대별 (Bar Chart)
- `DailyDataChart.tsx` - 일별 (Line Chart)

### 레이아웃 컴포넌트
- `Header.tsx` - 상단 헤더 (테마 전환, 새로고침)
- `Sidebar.tsx` - 사이드바 네비게이션
- `Dashboard.tsx` - 메인 대시보드 페이지
- `RealtimeWidget.tsx` - 실시간 현황 위젯

### 유틸리티
- `lib/googleSheets.ts` - 데이터 처리 로직
- `lib/useGoogleSheets.ts` - 데이터 페칭 훅
- `types.ts` - TypeScript 타입 정의

---

## 📈 성능 최적화

### 데이터 처리
- **useMemo**: 계산 집약적 연산 캐싱
- **배치 처리**: 대용량 데이터 분할 처리
- **중복 제거**: 전화번호 기준 중복 데이터 필터링

### 렌더링 최적화
- **React.memo**: 불필요한 리렌더링 방지
- **Lazy Loading**: 필요 시점에 컴포넌트 로드
- **Virtual Scrolling**: 대량 데이터 테이블 최적화

---

## 🔐 보안

### 인증 시스템
- **1차 인증**: 메인 로그인 (admin/wjdtjddjs)
- **2차 인증**: 민감한 페이지 접근 시 추가 인증
- **세션 관리**: localStorage 기반 인증 상태 유지

### 데이터 보호
- **서비스 계정 키**: 서버에서만 사용
- **환경 변수**: 민감 정보 암호화
- **CORS 설정**: 허용된 도메인만 접근

---

## 🐛 문제 해결

### WORKER_LIMIT 에러
**문제**: 10,000건 데이터 한 번에 처리 시 546 에러 발생

**해결**: 
```typescript
// 500건씩 20개 배치로 분할
const BATCH_SIZE = 500
const batches = Math.ceil(data.length / BATCH_SIZE)

for (let i = 0; i < batches; i++) {
  const batch = data.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
  await syncBatch(batch)
}
```

### 수임율 계산 오류
**문제**: 12월 문의가 1월 수임되면 1월로 집계됨

**해결**:
```typescript
// R열(수임일) 대신 B열(문의일) 기준으로 집계
const contractsFromInquiries = monthlyInquiries.filter(i => i.isContract === true)
```

---

## 📞 문의사항

프로젝트 관련 문의사항은 **정성언 주임**에게 연락 주세요.

---

## 📝 라이선스

이 프로젝트는 변리사 사무소 내부 사용 목적으로 개발되었습니다.

---

## 🔄 업데이트 히스토리

### v1.0.0 (2025-01)
- ✅ 초기 대시보드 구축
- ✅ 구글 스프레드시트 연동
- ✅ 배치 동기화 기능
- ✅ Google Apps Script 실시간 동기화
- ✅ Slack 알림 연동
- ✅ 모바일 반응형 최적화
- ✅ 다크모드 지원
- ✅ 수임율 계산 로직 개선 (문의 기준)
- ✅ 2026년 데이터 완전 제거
- ✅ 기본 날짜 2025년 12월로 설정

---

**Made with ❤️ for 특허법인**
