# 📤 GitHub 업로드 가이드

이 가이드는 Figma Make에서 작업한 프로젝트를 GitHub에 업로드하는 방법을 안내합니다.

## 🎯 목표

1. ✅ 코드를 GitHub에 백업
2. ✅ 로컬 환경에서 개발 가능하도록 설정
3. ✅ Supabase DB에 데이터 동기화

---

## 📋 사전 준비

### 1. GitHub 계정 및 저장소 생성

1. [GitHub](https://github.com) 로그인
2. 새 저장소 생성 (New Repository)
   - Repository name: `patent-office-dashboard` (원하는 이름)
   - **Private** 선택 (보안상 중요!)
   - README 초기화 **체크 해제**

### 2. Git 설치 확인

```bash
git --version
```

Git이 설치되어 있지 않다면 [Git 다운로드](https://git-scm.com/downloads)

---

## 🚀 업로드 절차

### 1단계: Figma Make에서 코드 다운로드

1. Figma Make 프로젝트 열기
2. 모든 파일 선택 → 다운로드
3. 압축 해제

### 2단계: 로컬 폴더에서 Git 초기화

```bash
# 프로젝트 폴더로 이동
cd patent-office-dashboard

# Git 초기화
git init

# 모든 파일 스테이징
git add .

# 첫 번째 커밋
git commit -m "Initial commit: Dashboard from Figma Make"
```

### 3단계: GitHub 저장소 연결

GitHub에서 생성한 저장소 URL을 복사 (예: `https://github.com/yourusername/patent-office-dashboard.git`)

```bash
# 원격 저장소 추가
git remote add origin https://github.com/yourusername/patent-office-dashboard.git

# 기본 브랜치 이름 설정 (main)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

### 4단계: 민감한 파일 확인

**⚠️ 중요: 다음 파일들이 GitHub에 업로드되지 않았는지 확인하세요!**

`.gitignore`에 이미 추가되어 있어야 하는 파일:

- ✅ `.env`
- ✅ `GOOGLE_SERVICE_ACCOUNT_KEY.txt`
- ✅ `GOOGLE_SERVICE_ACCOUNT_KEY.json`
- ✅ `node_modules/`

확인 방법:
```bash
# GitHub에 푸시된 파일 목록 확인
git ls-tree -r main --name-only

# .env 파일이 목록에 없어야 합니다!
# GOOGLE_SERVICE_ACCOUNT_KEY도 없어야 합니다!
```

만약 실수로 업로드했다면:
```bash
# 파일 제거 (GitHub에서만)
git rm --cached .env
git rm --cached GOOGLE_SERVICE_ACCOUNT_KEY.txt

# 커밋 및 푸시
git commit -m "Remove sensitive files"
git push origin main

# GitHub에서 해당 Secret 재생성 권장
```

---

## 🔄 로컬에서 클론하기

다른 컴퓨터에서 작업하려면:

```bash
# 저장소 클론
git clone https://github.com/yourusername/patent-office-dashboard.git
cd patent-office-dashboard

# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
cp .env.example .env
# .env 파일을 직접 수정하세요

# Google Service Account 키 추가
# GOOGLE_SERVICE_ACCOUNT_KEY.json 파일 생성 및 내용 붙여넣기

# 로컬 Supabase 시작
supabase start

# 개발 서버 실행
npm run dev
```

---

## 📂 GitHub에 포함된 파일 구조

```
patent-office-dashboard/
├── .gitignore                      # Git 제외 파일 목록
├── README.md                       # 프로젝트 설명
├── SETUP_LOCAL_SUPABASE.md         # Supabase 설정 가이드
├── GITHUB_SETUP.md                 # 이 파일
├── package.json                    # 프로젝트 의존성
├── vite.config.ts                  # Vite 설정
├── tsconfig.json                   # TypeScript 설정
├── index.html                      # HTML 엔트리
├── main.tsx                        # React 엔트리
├── .env.example                    # 환경 변수 예시
│
├── components/                     # React 컴포넌트
├── lib/                            # 유틸리티
├── types/                          # TypeScript 타입
├── styles/                         # CSS
├── supabase/                       # Supabase 설정
│   ├── config.toml                 # Supabase 로컬 설정
│   ├── migrations/                 # DB 마이그레이션
│   │   └── 001_create_tables.sql
│   └── functions/
│       └── server/                 # Edge Functions
│
└── (민감한 파일들은 .gitignore로 제외됨)
    ├── .env                        # ❌ GitHub에 없음
    ├── GOOGLE_SERVICE_ACCOUNT_KEY.json # ❌ GitHub에 없음
    └── node_modules/               # ❌ GitHub에 없음
```

---

## 🔐 보안 체크리스트

업로드 전 반드시 확인:

- [ ] `.env` 파일이 `.gitignore`에 있는가?
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` 파일이 `.gitignore`에 있는가?
- [ ] `node_modules/` 폴더가 제외되어 있는가?
- [ ] GitHub 저장소가 **Private**로 설정되어 있는가?
- [ ] README.md에 민감한 정보(API 키, 비밀번호)가 없는가?

---

## 🔄 일반적인 Git 작업 흐름

### 코드 수정 후 업데이트

```bash
# 변경된 파일 확인
git status

# 모든 변경사항 스테이징
git add .

# 커밋 메시지와 함께 커밋
git commit -m "Fix: 매체별 통계 카운트 오류 수정"

# GitHub에 푸시
git push origin main
```

### 다른 컴퓨터에서 최신 코드 가져오기

```bash
# 최신 코드 다운로드
git pull origin main
```

### 브랜치 생성 (기능 개발용)

```bash
# 새 브랜치 생성 및 전환
git checkout -b feature/add-sync-button

# 작업 후 커밋
git add .
git commit -m "Add DB sync button to dashboard"

# 브랜치 푸시
git push origin feature/add-sync-button

# GitHub에서 Pull Request 생성
```

---

## 📚 다음 단계

1. ✅ **GitHub 업로드 완료**
2. 📖 **[SETUP_LOCAL_SUPABASE.md](./SETUP_LOCAL_SUPABASE.md)** 읽기
3. 🚀 로컬 환경에서 개발 시작
4. 💾 DB 동기화 설정
5. 📊 SQL 쿼리로 데이터 분석

---

## ❓ 자주 묻는 질문

### Q1: GitHub에 실수로 비밀키를 올렸어요!

```bash
# 해당 파일을 Git 히스토리에서 완전히 제거
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 강제 푸시 (⚠️ 주의: 협업 시 팀원에게 알리기)
git push origin --force --all

# 그 후 해당 키를 즉시 재발급하세요!
```

### Q2: `.gitignore`를 추가했는데도 파일이 계속 추적돼요

```bash
# Git 캐시에서 제거
git rm -r --cached .
git add .
git commit -m "Fix .gitignore"
git push
```

### Q3: 로컬과 GitHub의 코드가 충돌해요

```bash
# GitHub의 코드를 우선 적용
git pull origin main --rebase

# 충돌 해결 후
git add .
git rebase --continue
```

---

## 🎉 완료!

이제 코드가 GitHub에 안전하게 백업되었고, 로컬에서 자유롭게 개발할 수 있습니다! 🚀

궁금한 점이 있으면 [GitHub Issues](https://github.com/yourusername/patent-office-dashboard/issues)에 문의하세요.
