import { useState, useEffect } from "react"
import { InquiryData, ContractData, AttorneyStats, FieldStats, GoogleSheetsConfig } from "../types"
import { 
  parseInquiryData, 
  parseContractData, 
  parseAttorneyStats, 
  parseFieldStats 
} from "./googleSheets"
import { mockInquiries, mockContracts, mockAttorneyStats, mockFieldStats } from "./mockData"
import { projectId, publicAnonKey } from "../utils/supabase/info"

// 자동 업데이트 간격 (밀리초) - 120초 (타임아웃 방지를 위해 더 길게)
const AUTO_REFRESH_INTERVAL = 120000
// 클라이언트 타임아웃 - 50초 (서버 45초 + 여유)
const CLIENT_TIMEOUT = 50000

// 데이터 처리 함수들
function processInquiryData(rawData: any[]): InquiryData[] {
  return parseInquiryData(rawData)
}

function processContractData(rawData: any[]): ContractData[] {
  return parseContractData(rawData)
}

function calculateAttorneyStats(rawData: any[]): AttorneyStats[] {
  return parseAttorneyStats(rawData)
}

function calculateFieldStats(rawData: any[]): FieldStats[] {
  return parseFieldStats(rawData)
}

/**
 * 구글 시트 데이터를 가져오는 커스텀 훅
 */
export function useGoogleSheets(config?: Partial<GoogleSheetsConfig>) {
  const [inquiries, setInquiries] = useState<InquiryData[]>(mockInquiries)
  const [contracts, setContracts] = useState<ContractData[]>(mockContracts)
  const [attorneyStats, setAttorneyStats] = useState<AttorneyStats[]>(mockAttorneyStats)
  const [fieldStats, setFieldStats] = useState<FieldStats[]>(mockFieldStats)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsingMockData, setIsUsingMockData] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)

  const loadData = async (silent = false) => {
    // silent 모드가 아닐 때만 로딩 상태 표시
    if (!silent) {
      setLoading(true)
      setError(null)
    }

    // 클라이언트 타임아웃 설정
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT)

    try {
      if (!silent) {
        console.log("🔄 데이터 요청 시작 (silent: false)")
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1da81fff/sheets/data`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ HTTP 에러 응답:`, errorText)
        throw new Error(`서버 응답 오류 (${response.status}): ${errorText}`)
      }

      const data = await response.json()

      // 환경 변수가 설정되지 않은 경우
      if (data.needsSetup) {
        console.warn('⚠️ 환경 변수 미설정 - 목업 데이터 사용')
        setIsUsingMockData(true)
        setInquiries(mockInquiries)
        setContracts(mockContracts)
        setAttorneyStats(mockAttorneyStats)
        setFieldStats(mockFieldStats)
        if (!silent) {
          setLastUpdated(new Date())
        }
        return
      }

      // 서버 에러 체크
      if (data.error) {
        console.error('❌ 서버 에러:', data.error, data.details)
        throw new Error(data.details || data.error)
      }

      setIsUsingMockData(false)

      // 데이터 처리
      const processedInquiries = processInquiryData(data.inquiries || [])
      const processedContracts = processContractData(data.inquiries || [])

      // ✅ 필터링 제거 - 모든 연도 데이터 표시
      console.log(`📊 [데이터 로드 완료] 문의: ${processedInquiries.length}건, 수임: ${processedContracts.length}건`)

      setInquiries(processedInquiries)
      setContracts(processedContracts)

      // 통계 계산 (원본 rawData 전달)
      const attorneys = calculateAttorneyStats(data.inquiries || [])
      const fields = calculateFieldStats(data.inquiries || [])

      setAttorneyStats(attorneys)
      setFieldStats(fields)

      // 데이터가 성공적으로 로드되었을 때 lastUpdated 업데이트
      setLastUpdated(new Date())
      
      // silent 모드가 아닐 때만 성공 로그
      if (!silent) {
        console.log('✅ 데이터 새로고침 완료')
      }
    } catch (err) {
      clearTimeout(timeoutId)
      
      // AbortError는 타임아웃을 의미
      if (err instanceof Error && err.name === 'AbortError') {
        console.error('⏱️ 요청 타임아웃 (50초 초과)')
        if (!silent) {
          setError('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.')
        }
      } else {
        console.error('❌ 데이터 로드 실패:', err)
        console.error('   스택:', err instanceof Error ? err.stack : '(없음)')
        // silent 모드가 아닐 때만 에러 표시
        if (!silent) {
          setError(err instanceof Error ? err.message : '데이터 로드 중 오류가 발생했습니다')
        } else {
          // silent 모드에서도 에러는 콘솔에만 표시
          console.error('🔄 자동 업데이트 중 오류 발생 (다음 주기에 재시도)')
        }
      }
      
      // 에러 발생 시 목업 데이터는 유지하지 않음 (기존 데이터 유지)
      // 처음 로드 시에만 목업 데이터 사용
      if (!silent && inquiries.length === 0) {
        console.warn('⚠️ 초기 로드 실패 - 목업 데이터 사용')
        setIsUsingMockData(true)
        setInquiries(mockInquiries)
        setContracts(mockContracts)
        setAttorneyStats(mockAttorneyStats)
        setFieldStats(mockFieldStats)
      }
    } finally {
      // silent 모드가 아닐 때만 로딩 상태 해제
      if (!silent) {
        setLoading(false)
      }
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    // 서버 배포 완료 - 실제 데이터 로드
    loadData()
  }, [])

  // 🔔 자동 업데이트 - 60초마다 백그라운드에서 데이터 새로고침
  useEffect(() => {
    if (!autoRefreshEnabled) return

    console.log('🔄 자동 업데이트 활성화 (60초 간격)')

    const intervalId = setInterval(() => {
      // 탭이 활성화되어 있을 때만 업데이트
      if (!document.hidden) {
        console.log('🔄 자동 업데이트 실행 중...')
        loadData(true) // silent 모드로 실행
      }
    }, AUTO_REFRESH_INTERVAL)

    // Visibility API를 사용하여 탭이 다시 활성화될 때 즉시 업데이트
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('���️ 탭 활성화 - 데이터 업데이트')
        loadData(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      console.log('🔄 자동 업데이트 비활성화')
    }
  }, [autoRefreshEnabled])

  return {
    inquiries,
    contracts,
    attorneyStats,
    fieldStats,
    loading,
    error,
    isUsingMockData,
    refetch: loadData,
    silentRefetch: () => loadData(true), // 백그라운드 새로고침 (UI 변화 없음)
    lastUpdated,
    autoRefreshEnabled,
    setAutoRefreshEnabled
  }
}