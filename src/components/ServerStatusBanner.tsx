import { useEffect, useState } from 'react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface ServerStatus {
  status: string
  timestamp: string
  secrets?: {
    hasSpreadsheetId: boolean
    hasServiceAccount: boolean
  }
}

export function ServerStatusBanner() {
  const [status, setStatus] = useState<ServerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setStatus(data)
        setLoading(false)
        
        // 콘솔에도 출력
        console.log('🔍 ===== 서버 상태 확인 =====')
        console.log('✅ 서버 연결:', data.status)
        console.log('📊 환경 변수 확인:')
        console.log('  - SPREADSHEET_ID:', data.secrets?.hasSpreadsheetId ? '✅ 설정됨' : '❌ 미설정')
        console.log('  - GOOGLE_SERVICE_ACCOUNT_KEY:', data.secrets?.hasServiceAccount ? '✅ 설정됨' : '❌ 미설정')
        console.log('⏰ 확인 시각:', data.timestamp)
        console.log('============================')
      } catch (err) {
        setError(err instanceof Error ? err.message : '서버 연결 실패')
        setLoading(false)
        console.error('❌ 서버 연결 실패:', err)
      }
    }
    
    checkServerHealth()
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-2">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          🔍 서버 상태 확인 중...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3">
        <p className="font-semibold text-red-900 dark:text-red-100 mb-1">❌ 서버 연결 실패</p>
        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
      </div>
    )
  }

  const allSecretsSet = status?.secrets?.hasSpreadsheetId && status?.secrets?.hasServiceAccount

  if (allSecretsSet) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-4 py-3">
        <p className="font-semibold text-green-900 dark:text-green-100 mb-1">✅ 서버 연결 성공!</p>
        <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
          <div>📊 SPREADSHEET_ID: ✅ 설정됨</div>
          <div>🔑 GOOGLE_SERVICE_ACCOUNT_KEY: ✅ 설정됨</div>
          <div>⏰ {status.timestamp}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
      <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">⚠️ 환경 변수 미설정</p>
      <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
        <div>📊 SPREADSHEET_ID: {status?.secrets?.hasSpreadsheetId ? '✅ 설정됨' : '❌ 미설정'}</div>
        <div>🔑 GOOGLE_SERVICE_ACCOUNT_KEY: {status?.secrets?.hasServiceAccount ? '✅ 설정됨' : '❌ 미설정'}</div>
        <div className="mt-2">Supabase Dashboard에서 환경 변수를 확인하세요.</div>
      </div>
    </div>
  )
}
