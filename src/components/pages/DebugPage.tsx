import { useState } from "react"
import { projectId, publicAnonKey } from '../../utils/supabase/info'

export function DebugPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const fetchDistribution = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1da81fff/api/debug/media-distribution`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      )
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('디버그 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-4">🔍 매체 분류 디버깅</h1>
        <button
          onClick={fetchDistribution}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "로딩 중..." : "데이터 분포 확인"}
        </button>
      </div>

      {data && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl mb-4">📊 전체 통계</h2>
            <p className="text-lg">전체 행 수: <span className="font-bold">{data.totalRows}</span></p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl mb-4">📈 매체별 분포</h2>
            <div className="space-y-4">
              {Object.entries(data.mediaDistribution || {}).map(([category, info]: [string, any]) => (
                <div key={category} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{category}</h3>
                    <span className="text-2xl font-bold text-blue-600">{info.count}건</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    예시: {info.examples.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl mb-4">🏆 Top 20 세부매체</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-2 px-4">순위</th>
                    <th className="text-left py-2 px-4">세부매체</th>
                    <th className="text-right py-2 px-4">건수</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topDetailSources?.map((item: any, index: number) => (
                    <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4 font-mono text-sm">{item.source}</td>
                      <td className="py-2 px-4 text-right font-semibold">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
