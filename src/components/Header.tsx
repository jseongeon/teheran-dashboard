import { Settings, Sun, Moon, Monitor, Home, ExternalLink, FileText, LogOut, RefreshCw, Radio, Database, Menu } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { PageState } from "../App"
import { Switch } from "./ui/switch"
import { useEffect, useState } from "react"
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { toast } from "sonner"

type Theme = 'light' | 'dark' | 'system'

interface HeaderProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  setCurrentPage: (page: PageState) => void
  onLogout?: () => void
  onRefresh?: () => void
  lastUpdated?: Date | null
  isRefreshing?: boolean
  autoRefreshEnabled?: boolean
  setAutoRefreshEnabled?: (enabled: boolean) => void
  onMenuClick?: () => void
}

export function Header({ 
  theme, 
  setTheme, 
  setCurrentPage, 
  onLogout, 
  onRefresh, 
  lastUpdated, 
  isRefreshing,
  autoRefreshEnabled,
  setAutoRefreshEnabled,
  onMenuClick
}: HeaderProps) {
  const [serverConnected, setServerConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [authPassword, setAuthPassword] = useState("")
  const [pendingSyncAction, setPendingSyncAction] = useState<'db' | 'batch' | null>(null)
  const [syncProgress, setSyncProgress] = useState(0)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  // 서버 연결 상태 확인
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-1da81fff/health`,
          {
            headers: { 'Authorization': `Bearer ${publicAnonKey}` }
          }
        )
        const data = await response.json()
        
        // 서버가 정상이고 필수 환경변수가 설정되어 있으면 연결 성공
        const isConnected = data.status === 'ok' && 
                           data.secrets?.hasSpreadsheetId && 
                           data.secrets?.hasServiceAccount
        setServerConnected(isConnected)
      } catch (error) {
        setServerConnected(false)
      }
    }
    
    checkServerHealth()
  }, [])

  // DB 동기화 함수 (암호 확인 후 실행)
  const handleSyncToDatabase = async () => {
    setIsSyncing(true)
    toast.info("🔄 DB 동기화 시작...")

    try {
      // 기존 작동하는 /api/sync-to-db 엔드포인트 사용 (로컬 + 클라우드 동시 동기화)
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-1da81fff/api/sync-to-db`
      console.log("🌐 동기화 요청 URL:", url)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      console.log("📡 응답 상태:", response.status, response.statusText)
      const responseText = await response.text()
      console.log("📄 응답 내용:", responseText)

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("❌ JSON 파싱 실패:", parseError)
        throw new Error(`서버 응답을 파싱할 수 없습니다: ${responseText.substring(0, 200)}`)
      }

      if (result.success) {
        // 로컬과 클라우드 결과 모두 표시
        const localInfo = result.local?.stats 
          ? `로컬: ${result.local.stats.total || 0}건 (신규: ${result.local.stats.inserted || 0}, 업데이트: ${result.local.stats.updated || 0})`
          : result.local?.skipped ? "로컬: 건너뜀" : "로컬: 없음"
        
        const cloudInfo = result.cloud?.stats 
          ? `클라우드: ${result.cloud.stats.total || 0}건 (신규: ${result.cloud.stats.inserted || 0}, 업데이트: ${result.cloud.stats.updated || 0})`
          : result.cloud?.skipped ? "클라우드: 건너뜀" : "클라우드: 없음"

        toast.success("✅ DB 동기화 완료!", {
          description: `${localInfo}\n${cloudInfo}`,
          duration: 5000
        })
      } else if (result.needsSetup) {
        toast.warning("⚠️ 환경 변수 미설정", {
          description: result.error || "구글 스프레드시트 또는 Supabase 환경 변수를 설정해주세요.",
          duration: 5000
        })
      } else {
        toast.error("❌ 동기화 실패", {
          description: result.error || "알 수 없는 오류"
        })
      }
    } catch (error) {
      console.error("❌ DB 동기화 오류:", error)
      toast.error("❌ DB 동기화 오류", {
        description: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // 배치 동기화 함수 (암호 확인 후 실행)
  const handleBatchSync = async () => {
    const BATCH_SIZE = 500 // 500건씩
    const TOTAL_ROWS = 10000 // 여유있게 설정 (빈 행은 자동 필터링됨)
    const START_ROW = 5 // B5부터 시작 (헤더 4행 제외)
    
    setIsSyncing(true)
    toast.info(`🔄 배치 동기화 시작 (약 ${Math.ceil(TOTAL_ROWS / BATCH_SIZE)}개 배치)`)

    let successCount = 0
    let errorCount = 0

    try {
      for (let start = 0; start < TOTAL_ROWS; start += BATCH_SIZE) {
        const startRow = START_ROW + start
        const endRow = Math.min(START_ROW + start + BATCH_SIZE - 1, START_ROW + TOTAL_ROWS - 1)
        
        console.log(`🔄 배치 ${Math.floor(start / BATCH_SIZE) + 1}/${Math.ceil(TOTAL_ROWS / BATCH_SIZE)}: 행 ${startRow}~${endRow}`)
        
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-1da81fff/api/sync-to-db-range`
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ startRow, endRow })
        })

        const result = await response.json()

        if (result.success) {
          successCount += result.processed || 0
          console.log(`✅ 배치 완료: ${result.processed}건 처리`)
          
          // 진행률 토스트
          toast.info(`진행 중: ${successCount}/${TOTAL_ROWS}건 (${Math.round(successCount / TOTAL_ROWS * 100)}%)`, {
            duration: 1000
          })
        } else {
          errorCount++
          console.error(`❌ 배치 실패 (${startRow}~${endRow}):`, result.error)
        }

        // 배치 사이 5초 대기 (서버 부하 방지)
        if (start + BATCH_SIZE < TOTAL_ROWS) {
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
      }

      // 완료 메시지
      if (errorCount === 0) {
        toast.success(`🎉 전체 동기화 완료!`, {
          description: `${successCount}건 성공`,
          duration: 5000
        })
      } else {
        toast.warning(`⚠️ 동기화 완료 (일부 실패)`, {
          description: `성공: ${successCount}건 / 실패: ${errorCount}개 배치`,
          duration: 5000
        })
      }

    } catch (error) {
      console.error("❌ 배치 동기화 오류:", error)
      toast.error("❌ 배치 동기화 오류", {
        description: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // 암호 인증 요청
  const requestSync = (type: 'db' | 'batch') => {
    setPendingSyncAction(type)
    setAuthPassword("")
    setIsAuthDialogOpen(true)
  }

  // 암호 확인 및 동기화 실행
  const handleAuthSubmit = () => {
    if (authPassword === "wjdtjddjs") {
      setIsAuthDialogOpen(false)
      setAuthPassword("")
      
      if (pendingSyncAction === 'db') {
        handleSyncToDatabase()
      } else if (pendingSyncAction === 'batch') {
        handleBatchSync()
      }
      
      setPendingSyncAction(null)
    } else {
      toast.error("❌ 잘못된 암호입니다")
      setAuthPassword("")
    }
  }

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "업데이트 전"
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    
    if (diffSecs < 60) return `${diffSecs}초 전`
    const diffMins = Math.floor(diffSecs / 60)
    if (diffMins < 60) return `${diffMins}분 전`
    
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        {/* 모바일 햄버거 메뉴 */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden flex-shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="text-lg md:text-2xl truncate">Analytics Dashboard</h1>
        
        {/* 마지막 업데이트 시간 표시 - 모바일에서 숨김 */}
        {lastUpdated && (
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            <span>•</span>
            <span>{formatLastUpdated(lastUpdated)} 업데이트</span>
            {autoRefreshEnabled && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Radio className="h-3 w-3 animate-pulse" />
                자동
              </span>
            )}
          </div>
        )}
        
        {/* 서버 연결 상태 표시 - 모바일에서 숨김 */}
        {serverConnected && (
          <div className="hidden lg:flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <span>•</span>
            <span>✅ 서버 연결 성공</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* DB 동기화 버튼 - 모바일에서 숨김 */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => requestSync('db')}
          disabled={isSyncing}
          title="클라우드 Supabase DB에 데이터 백업"
          className="hidden md:flex gap-2"
        >
          <Database className={`h-4 w-4 ${isSyncing ? 'animate-pulse' : ''}`} />
          {isSyncing ? '동기화 중...' : 'DB 동기화'}
        </Button>
        
        {/* 배치 동기화 버튼 - 모바일에서 숨김 */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => requestSync('batch')}
          disabled={isSyncing}
          title="클라우드 Supabase DB에 데이터 백업 (배치)"
          className="hidden md:flex gap-2"
        >
          <Database className={`h-4 w-4 ${isSyncing ? 'animate-pulse' : ''}`} />
          {isSyncing ? '동기화 중...' : '배치 동기화'}
        </Button>
        
        {/* 자동 업데이트 토글 - 모바일에서 숨김 */}
        {setAutoRefreshEnabled && (
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50">
            <span className="text-sm text-muted-foreground">자동 업데이트</span>
            <Switch 
              checked={autoRefreshEnabled}
              onCheckedChange={setAutoRefreshEnabled}
            />
          </div>
        )}
        
        {/* 새로고침 버튼 */}
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="데이터 새로고침 (수동)"
            className="flex-shrink-0"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
        
        {/* 홈 이동 - 모바일에서 숨김 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden md:flex"
            >
              <Home className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>홈 이동</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => window.open('https://lily-honeydew-416.notion.site/28e4c52da78380e4bee7c782c4aaabbe?source=copy_link', '_blank')}
              className="cursor-pointer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>포털홈페이지로 이동</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setCurrentPage({ main: "홈" })}
              className="cursor-pointer"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>메인요약보고서로 이동</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>테마 설정</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setTheme('light')}
              className="cursor-pointer"
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>라이트 모드</span>
              {theme === 'light' && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme('dark')}
              className="cursor-pointer"
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>다크 모드</span>
              {theme === 'dark' && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme('system')}
              className="cursor-pointer"
            >
              <Monitor className="mr-2 h-4 w-4" />
              <span>시스템 설정</span>
              {theme === 'system' && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </DropdownMenuItem>
            {onLogout && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="cursor-pointer text-red-600 dark:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    {/* 암호 인증 다이얼로그 */}
    <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>관리자 인증</DialogTitle>
          <DialogDescription>
            DB 동기화를 실행하려면 관리자 암호를 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="password"
            placeholder="암호 입력"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAuthSubmit()
              }
            }}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAuthDialogOpen(false)}>
            취소
          </Button>
          <Button onClick={handleAuthSubmit}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}