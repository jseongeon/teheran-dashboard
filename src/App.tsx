import { Header } from "./components/Header"
import { Sidebar } from "./components/Sidebar"
import { Dashboard } from "./components/Dashboard"
import { RealtimePage } from "./components/pages/RealtimePage"
import { InquiryPage } from "./components/pages/InquiryPage"
import { ContractPage } from "./components/pages/ContractPage"
import { AdditionalMetricsPage } from "./components/pages/AdditionalMetricsPage"
import { DetailedMetricsPage } from "./components/pages/DetailedMetricsPage"
import { DetailedMediaPage } from "./components/pages/DetailedMediaPage"
// DebugPage import 제거
import { LoginPage } from "./components/LoginPage"
import { SecondaryAuthDialog } from "./components/SecondaryAuthDialog"
// ServerStatusBanner import 제거
import { useEffect, useState, useRef } from "react"
import { useGoogleSheets } from "./lib/useGoogleSheets"
import { projectId } from './utils/supabase/info'

type Theme = 'light' | 'dark' | 'system'

export interface PageState {
  main: string
  sub?: string
}

// 인증 정보 (실제 프로덕션에서는 백엔드에서 관리해야 합니다)
const CREDENTIALS = {
  username: "admin",
  password: "wjdtjddjs123"
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    // localStorage에서 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('theme') as Theme
    return savedTheme || 'system'
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // localStorage에서 로그인 상태 불러오기
    return localStorage.getItem('isAuthenticated') === 'true'
  })

  const [isSecondaryAuthOpen, setIsSecondaryAuthOpen] = useState(false)
  const [pendingPage, setPendingPage] = useState<PageState | null>(null)
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState<PageState>({
    main: "홈",
    sub: undefined
  })

  // 메인 콘텐츠 영역 ref
  const mainContentRef = useRef<HTMLElement>(null)

  // 페이지 전환 시 스크롤 맨 위로 이동
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0)
    }
  }, [currentPage])

  // 🔍 서버 Health Check (자동 실행)
  useEffect(() => {
    // 서버 상태 확인
    async function checkServerStatus() {
      try {
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1da81fff/health`)
      } catch (error) {
        console.error('서버 상태 확인 실패:', error)
      }
    }
    checkServerStatus()
  }, [])

  // 구글 시트 데이터 가져오기
  const { inquiries, contracts, attorneyStats, fieldStats, loading, error, isUsingMockData, refetch, silentRefetch, lastUpdated, autoRefreshEnabled, setAutoRefreshEnabled } = useGoogleSheets()

  // 🔔 자동 업데이트 활성화됨 - 30초마다 자동으로 데이터를 새로고침합니다.
  // Google Sheets에 새 데이터가 추가되면 페이지 새로고침 없이 자동으로 반영됩니다.
  // 헤더의 토글 버튼으로 자동 업데이트를 켜거나 끌 수 있습니다.

  // 로그인 핸들러
  const handleLogin = (username: string, password: string): boolean => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      setIsAuthenticated(true)
      localStorage.setItem('isAuthenticated', 'true')
      return true
    }
    return false
  }

  // 로그아웃 핸들러
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
  }

  // 페이지 변경 핸들러 (2차 인증 체크 포함)
  const handleSetCurrentPage = (page: PageState) => {
    // 문의/수임/실시간 페이지 접근 시 2차 인증 필요 (고객 개인정보 보호)
    if (page.main === "문의" || page.main === "수임" || page.main === "실시간") {
      setPendingPage(page)
      setIsSecondaryAuthOpen(true)
    } else {
      setCurrentPage(page)
    }
  }

  // 2차 인증 성공
  const handleSecondaryAuthSuccess = () => {
    if (pendingPage) {
      setCurrentPage(pendingPage)
      setPendingPage(null)
    }
    setIsSecondaryAuthOpen(false)
  }

  // 2차 인증 취소
  const handleSecondaryAuthCancel = () => {
    setPendingPage(null)
    setIsSecondaryAuthOpen(false)
  }

  // 다크모드 여부 계산
  const isDarkMode = () => {
    if (theme === 'dark') return true
    if (theme === 'light') return false
    // system인 경우 시스템 테마 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  useEffect(() => {
    const root = window.document.documentElement
    
    // 시스템 테마 확인
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    // 적용할 테마 결정
    const appliedTheme = theme === 'system' ? systemTheme : theme
    
    // dark 클래스 추가/제거
    root.classList.remove('light', 'dark')
    root.classList.add(appliedTheme)
    
    // localStorage에 저장
    localStorage.setItem('theme', theme)
  }, [theme])

  // 로그인되지 않은 경우 로그인 페이지 표시
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  const renderPage = () => {
    const darkMode = isDarkMode()
    
    switch (currentPage.main) {
      case "홈":
        return <Dashboard inquiries={inquiries} contracts={contracts} isDarkMode={darkMode} />
      case "실시간":
        return <RealtimePage inquiries={inquiries} contracts={contracts} />
      case "문의":
        return <InquiryPage subPage={currentPage.sub} inquiries={inquiries} />
      case "수임":
        return <ContractPage subPage={currentPage.sub} contracts={contracts} />
      case "추가지표":
        return <AdditionalMetricsPage subPage={currentPage.sub} attorneyStats={attorneyStats} fieldStats={fieldStats} inquiries={inquiries} isDarkMode={darkMode} />
      case "세부지표":
        return <DetailedMetricsPage subPage={currentPage.sub} inquiries={inquiries} contracts={contracts} isDarkMode={darkMode} />
      case "세부매체 데이터":
        return <DetailedMediaPage subPage={currentPage.sub} inquiries={inquiries} contracts={contracts} isDarkMode={darkMode} />
      default:
        return <Dashboard inquiries={inquiries} contracts={contracts} isDarkMode={darkMode} />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header 
        theme={theme} 
        setTheme={setTheme} 
        setCurrentPage={handleSetCurrentPage} 
        onLogout={handleLogout}
        onRefresh={refetch}
        lastUpdated={lastUpdated}
        isRefreshing={loading}
        autoRefreshEnabled={autoRefreshEnabled}
        setAutoRefreshEnabled={setAutoRefreshEnabled}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />
      
      {isUsingMockData && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ 구글 시트 API가 설정되지 않아 목업 데이터를 사용 중입니다. 
            <a href="/README_GOOGLE_SHEETS.md" className="underline ml-1">연동 가이드 보기</a>
          </p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-2">
          <p className="text-sm text-red-800 dark:text-red-200">
            ⚠️ 데이터 로드 중 오류 발생: {error}
          </p>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={handleSetCurrentPage}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <main ref={mainContentRef} className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
      
      {/* 2차 인증 다이얼로그 */}
      <SecondaryAuthDialog 
        open={isSecondaryAuthOpen}
        onSuccess={handleSecondaryAuthSuccess}
        onCancel={handleSecondaryAuthCancel}
      />
    </div>
  )
}