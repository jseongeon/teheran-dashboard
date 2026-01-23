import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { InquiryData, ContractData } from "../../types"
import { useMemo, useState, useEffect } from "react"
import { filterBySource, countInquiries, filterHomepageByType, filterViralByType } from "../../lib/googleSheets"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { ChevronDown } from "lucide-react"

interface DetailedMediaPageProps {
  subPage?: string
  inquiries: InquiryData[]
  contracts: ContractData[]
  isDarkMode: boolean
}

const MEDIA_SOURCES = ["홈페이지 · 유료광고", "바이럴", "기타", "문의건X"]
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]

export function DetailedMediaPage({ subPage, inquiries, contracts, isDarkMode }: DetailedMediaPageProps) {
  const [activeTab, setActiveTab] = useState(subPage || "홈페이지 · 유료광고")
  const [homepageFilter, setHomepageFilter] = useState<"전체" | "유선" | "채팅">("전체")
  const [isMediaClassificationOpen, setIsMediaClassificationOpen] = useState(false)

  // subPage가 변경되면 activeTab 업데이트
  useEffect(() => {
    if (subPage) {
      setActiveTab(subPage)
    }
  }, [subPage])

  // 선택된 매체에 따라 필터링
  const filteredInquiries = useMemo(() => {
    return filterBySource(inquiries, activeTab)
  }, [inquiries, activeTab])

  const filteredContracts = useMemo(() => {
    return filterBySource(contracts, activeTab)
  }, [contracts, activeTab])

  // 매체별 문의 건수 (중복 제거 로직 적용)
  const mediaInquiryData = useMemo(() => {
    return MEDIA_SOURCES.map(source => {
      const sourceInquiries = inquiries.filter(i => i.source === source)
      return {
        name: source,
        문의건수: countInquiries(sourceInquiries)
      }
    })
  }, [inquiries])

  // 매체별 수임 건수
  const mediaContractData = useMemo(() => {
    return MEDIA_SOURCES.map(source => ({
      name: source,
      수임건수: contracts.filter(c => c.source === source).length
    }))
  }, [contracts])

  // 매체별 수임율 (중복 제거 로직 적용)
  const mediaConversionData = useMemo(() => {
    return MEDIA_SOURCES.map(source => {
      const sourceInquiries = inquiries.filter(i => i.source === source)
      const inquiryCount = countInquiries(sourceInquiries)
      // ⭐ 수임건: 문의 기준 (inquiries에서 isContract === true)
      const contractCount = sourceInquiries.filter(i => i.isContract).length
      const rate = inquiryCount > 0 ? ((contractCount / inquiryCount) * 100).toFixed(1) : "0.0"
      
      return {
        name: source,
        수임율: parseFloat(rate)
      }
    })
  }, [inquiries, contracts])

  // 매체별 종합 통계 (중복 제거 로직 적용)
  const mediaStats = useMemo(() => {
    return MEDIA_SOURCES.map((source, index) => {
      const sourceInquiries = inquiries.filter(i => i.source === source)
      const inquiryCount = countInquiries(sourceInquiries)
      
      return {
        name: source,
        value: inquiryCount,
        color: COLORS[index]
      }
    })
  }, [inquiries, contracts])

  // 다크모드 대응 툴팁 스타일
  const tooltipStyle = {
    contentStyle: {
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      borderRadius: '6px',
      color: isDarkMode ? '#f3f4f6' : '#111827'
    },
    labelStyle: {
      color: isDarkMode ? '#f3f4f6' : '#111827'
    }
  }

  // 홈페이지 세부 통계 (유선/채팅별)
  const homepageDetailStats = useMemo(() => {
    const 유선Inquiries = filterHomepageByType(inquiries, "유선")
    const 채팅Inquiries = filterHomepageByType(inquiries, "채팅")
    const 기타Inquiries = filterHomepageByType(inquiries, "기타")
    const 유선Contracts = filterHomepageByType(contracts, "유선")
    const 채팅Contracts = filterHomepageByType(contracts, "채팅")
    const 기타Contracts = filterHomepageByType(contracts, "기타")
    
    const 유선문의 = countInquiries(유선Inquiries)
    const 채팅문의 = countInquiries(채팅Inquiries)
    const 기타문의 = countInquiries(기타Inquiries)
    const 유선수임 = 유선Contracts.length
    const 채팅수임 = 채팅Contracts.length
    const 기타수임 = 기타Contracts.length
    
    return {
      유선: {
        문의: 유선문의,
        수임: 유선수임,
        수임율: 유선문의 > 0 ? ((유선수임 / 유선문의) * 100).toFixed(1) : "0.0",
        예시: "메인홈페이지_8230, 구홈페이지, 서울플레이스_5059, 부산플레이스_1970, 파워컨텐츠_2383, 유튜브_1737"
      },
      채팅: {
        문의: 채팅문의,
        수임: 채팅수임,
        수임율: 채팅문의 > 0 ? ((채팅수임 / 채팅문의) * 100).toFixed(1) : "0.0",
        예시: "메인홈페이지, 구홈페이지, 세모특허원페이지, 서울플레이스, 부산플레이스, 유튜브, 파워컨텐츠"
      },
      기타: {
        문의: 기타문의,
        수임: 기타수임,
        수임율: 기타문의 > 0 ? ((기타수임 / 기타문의) * 100).toFixed(1) : "0.0",
        예시: "게시판문의, 상담신청, 자가진단, 메일, 팝업창, 캠페인신청_폼, 구홈_자가, 구홈_상담신청, 구홈_게시판, 플레이스_예약"
      }
    }
  }, [inquiries, contracts])

  // 바이럴 세부 통계 (유선/채팅/기타별)
  const viralDetailStats = useMemo(() => {
    const 유선Inquiries = filterViralByType(inquiries, "유선")
    const 채팅Inquiries = filterViralByType(inquiries, "채팅")
    const 기타Inquiries = filterViralByType(inquiries, "기타")
    const 유선Contracts = filterViralByType(contracts, "유선")
    const 채팅Contracts = filterViralByType(contracts, "채팅")
    const 기타Contracts = filterViralByType(contracts, "기타")
    
    const 유선문의 = countInquiries(유선Inquiries)
    const 채팅문의 = countInquiries(채팅Inquiries)
    const 기타문의 = countInquiries(기타Inquiries)
    const 유선수임 = 유선Contracts.length
    const 채팅수임 = 채팅Contracts.length
    const 기타수임 = 기타Contracts.length
    
    return {
      유선: {
        문의: 유선문의,
        수임: 유선수임,
        수임율: 유선문의 > 0 ? ((유선수임 / 유선문의) * 100).toFixed(1) : "0.0",
        예시: "블로그/카페/지식인 (전화번호 포함)"
      },
      채팅: {
        문의: 채팅문의,
        수임: 채팅수임,
        수임율: 채팅문의 > 0 ? ((채팅수임 / 채팅문의) * 100).toFixed(1) : "0.0",
        예시: "블로그/카페/지식인"
      },
      기타: {
        문의: 기타문의,
        수임: 기타수임,
        수임율: 기타문의 > 0 ? ((기타수임 / 기타문의) * 100).toFixed(1) : "0.0",
        예시: "폼/댓글/메일/업무폰"
      }
    }
  }, [inquiries, contracts])

  // 기타 세부 통계
  const etcDetailStats = useMemo(() => {
    const etcInquiries = inquiries.filter(i => i.source === "기타")
    const etcContracts = contracts.filter(c => c.source === "기타")
    
    const 유선Inquiries = etcInquiries.filter(i => i.receiptType === "유선")
    const 채팅Inquiries = etcInquiries.filter(i => i.receiptType === "채팅")
    const 기타Inquiries = etcInquiries.filter(i => i.receiptType === "기타")
    
    const 유선Contracts = etcContracts.filter(c => c.receiptType === "유선")
    const 채팅Contracts = etcContracts.filter(c => c.receiptType === "채팅")
    const 기타Contracts = etcContracts.filter(c => c.receiptType === "기타")
    
    const 유선문의 = countInquiries(유선Inquiries)
    const 채팅문의 = countInquiries(채팅Inquiries)
    const 기타문의 = countInquiries(기타Inquiries)
    const 유선수임 = 유선Contracts.length
    const 채팅수임 = 채팅Contracts.length
    const 기타수임 = 기타Contracts.length
    
    return {
      유선: {
        문의: 유선문의,
        수임: 유선수임,
        수임율: 유선문의 > 0 ? ((유선수임 / 유선문의) * 100).toFixed(1) : "0.0",
        예시: "번호추적불가, 카카오플레이스_4909, 공식블로그_4247"
      },
      채팅: {
        문의: 채팅문의,
        수임: 채팅수임,
        수임율: 채팅문의 > 0 ? ((채팅수임 / 채팅문의) * 100).toFixed(1) : "0.0",
        예시: "카카오플레이스, 기타경로, 공식블로그"
      },
      기타: {
        문의: 기타문의,
        수임: 기타수임,
        수임율: 기타문의 > 0 ? ((기타수임 / 기타문의) * 100).toFixed(1) : "0.0",
        예시: "카카오_예약, 기타"
      }
    }
  }, [inquiries, contracts])

  // 문의건X 통계 (유형 구분 없이 전체)
  const excludedStats = useMemo(() => {
    const excludedInquiries = inquiries.filter(i => i.source === "문의건X")

    const 총문의 = countInquiries(excludedInquiries)
    // ⭐ 수임건: 문의 기준 (inquiries에서 isContract === true)
    const 총수임 = excludedInquiries.filter(i => i.isContract).length

    return {
      문의: 총문의,
      수임: 총수임,
      수임율: 총문의 > 0 ? ((총수임 / 총문의) * 100).toFixed(1) : "0.0",
      세부매체: "리마인드CRM, 문의외수임, 연락처중복, crm메일, 타법인전달, 직통문의"
    }
  }, [inquiries])

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-3 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">세부매체 분석</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          매체별 상세 성과를 분석하세요
        </p>
      </div>

      {/* 매체별 요약 카드 */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        {MEDIA_SOURCES.map((source, index) => {
          const sourceInquiries = inquiries.filter(i => i.source === source)
          const inquiryCount = countInquiries(sourceInquiries)
          const contractCount = contracts.filter(c => c.source === source).length
          const rate = inquiryCount > 0 ? ((contractCount / inquiryCount) * 100).toFixed(1) : "0.0"
          
          return (
            <Card key={source}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
                <CardTitle className="text-xs md:text-sm font-medium truncate pr-2">{source}</CardTitle>
                <div
                  className="h-2 w-2 md:h-3 md:w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index] }}
                />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold">{inquiryCount}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  <span className="hidden sm:inline">문의 {inquiryCount}건 · 수임 {contractCount}건 · 수임율 {rate}%</span>
                  <span className="sm:hidden">수임 {contractCount} · {rate}%</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 매체별 문의/수임 비교 차트 */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg">매체별 문의 건수</CardTitle>
            <CardDescription className="text-xs md:text-sm">각 매체에서 유입된 문의 건수</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <ResponsiveContainer width="100%" height={250} className="md:!h-[300px]">
              <BarChart data={mediaInquiryData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="name" 
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11 }}
                />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip {...tooltipStyle} />
                <Legend />
                <Bar dataKey="문의건수">
                  {mediaInquiryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg">매체별 수임 건수</CardTitle>
            <CardDescription className="text-xs md:text-sm">각 매체에서 전환된 수임 건수</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <ResponsiveContainer width="100%" height={250} className="md:!h-[300px]">
              <BarChart data={mediaContractData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis
                  dataKey="name"
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fontSize: 10 }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} tick={{ fontSize: 10 }} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="수임건수">
                  {mediaContractData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 매체별 수임율 및 분포 */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg">매체별 수임율</CardTitle>
            <CardDescription className="text-xs md:text-sm">문의 대비 수임 전환율</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <ResponsiveContainer width="100%" height={250} className="md:!h-[300px]">
              <BarChart data={mediaConversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis
                  dataKey="name"
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fontSize: 10 }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fontSize: 10 }}
                  label={{ value: '%', position: 'insideLeft', fontSize: 10 }}
                />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="수임율">
                  {mediaConversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg">매체별 문의 분포</CardTitle>
            <CardDescription className="text-xs md:text-sm">전체 문의 중 각 매체의 비중</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <ResponsiveContainer width="100%" height={250} className="md:!h-[300px]">
              <PieChart>
                <Pie
                  data={mediaStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  dataKey="value"
                >
                  {mediaStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                      stroke={isDarkMode ? '#1f2937' : '#ffffff'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: '11px' }}
                  formatter={(value) => <span style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 홈페이지 세부 분석 */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg">홈페이지/유료광고 유형별 통계</CardTitle>
          <CardDescription className="text-xs md:text-sm">유선/채팅/기타 상담 유형별 성과 분석</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <table className="w-full min-w-[500px] md:min-w-0">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">유형</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">문의</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">수임</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">수임율</th>
                  <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm hidden sm:table-cell">세부 매체</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 md:py-3 px-3 md:px-4">유선</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{homepageDetailStats.유선.문의}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{homepageDetailStats.유선.수임}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{homepageDetailStats.유선.수임율}%</td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{homepageDetailStats.유선.예시}</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 md:py-3 px-3 md:px-4">채팅</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{homepageDetailStats.채팅.문의}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{homepageDetailStats.채팅.수임}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{homepageDetailStats.채팅.수임율}%</td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{homepageDetailStats.채팅.예시}</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="py-2 md:py-3 px-3 md:px-4">기타</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{homepageDetailStats.기타.문의}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{homepageDetailStats.기타.수임}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{homepageDetailStats.기타.수임율}%</td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{homepageDetailStats.기타.예시}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 바이럴 세부 분석 */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg">바이럴 유형별 통계</CardTitle>
          <CardDescription className="text-xs md:text-sm">유선/채팅/기타 상담 유형별 성과 분석</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <table className="w-full min-w-[500px] md:min-w-0">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">유형</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">문의</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">수임</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">수임율</th>
                  <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm hidden sm:table-cell">세부 매체</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 md:py-3 px-3 md:px-4">유선</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{viralDetailStats.유선.문의}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{viralDetailStats.유선.수임}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{viralDetailStats.유선.수임율}%</td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{viralDetailStats.유선.예시}</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 md:py-3 px-3 md:px-4">채팅</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{viralDetailStats.채팅.문의}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{viralDetailStats.채팅.수임}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{viralDetailStats.채팅.수임율}%</td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{viralDetailStats.채팅.예시}</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="py-2 md:py-3 px-3 md:px-4">기타</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{viralDetailStats.기타.문의}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{viralDetailStats.기타.수임}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{viralDetailStats.기타.수임율}%</td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{viralDetailStats.기타.예시}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 기타 세부 분석 */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg">기타 유형별 통계</CardTitle>
          <CardDescription className="text-xs md:text-sm">유선/채팅/기타 상담 유형별 성과 분석</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <table className="w-full min-w-[500px] md:min-w-0">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">유형</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">문의</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">수임</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">수임율</th>
                  <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm hidden sm:table-cell">세부 매체</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 md:py-3 px-3 md:px-4">유선</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{etcDetailStats.유선.문의}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{etcDetailStats.유선.수임}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{etcDetailStats.유선.수임율}%</td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{etcDetailStats.유선.예시}</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 md:py-3 px-3 md:px-4">채팅</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{etcDetailStats.채팅.문의}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{etcDetailStats.채팅.수임}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{etcDetailStats.채팅.수임율}%</td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{etcDetailStats.채팅.예시}</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="py-2 md:py-3 px-3 md:px-4">기타</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{etcDetailStats.기타.문의}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{etcDetailStats.기타.수임}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{etcDetailStats.기타.수임율}%</td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{etcDetailStats.기타.예시}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 문의건X 통계 */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg">문의건X 통계</CardTitle>
          <CardDescription className="text-xs md:text-sm">문의건으로 카운트되지 않는 항목</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <table className="w-full min-w-[500px] md:min-w-0">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">유형</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">문의</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">수임</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">수임율</th>
                  <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm hidden sm:table-cell">세부 매체</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                <tr className="hover:bg-muted/50">
                  <td className="py-2 md:py-3 px-3 md:px-4">-</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{excludedStats.문의}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{excludedStats.수임}</td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4">{excludedStats.수임율}%</td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">{excludedStats.세부매체}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 매체 분류 기준표 (토글) */}
      <Collapsible open={isMediaClassificationOpen} onOpenChange={setIsMediaClassificationOpen}>
        <Card className={`transition-all duration-200 ${!isMediaClassificationOpen ? 'hover:shadow-md hover:border-primary/30' : ''}`}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors select-none p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base md:text-lg">매체 분류 기준 (E열 세부매체)</CardTitle>
                  <CardDescription className="text-xs md:text-sm">각 매체 카테고리별 세부매체 목록</CardDescription>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-muted-foreground">
                  <span className="text-xs md:text-sm font-medium">{isMediaClassificationOpen ? '📂 접기' : '📁 펼치기'}</span>
                  <ChevronDown className={`h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 ${isMediaClassificationOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* 홈페이지 · 유료광고 */}
            <div className="border rounded-lg p-3 md:p-4" style={{ backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)', borderColor: '#3b82f6' }}>
              <h3 className="font-bold mb-2 md:mb-3 text-center pb-2 border-b text-sm md:text-base" style={{ color: '#3b82f6' }}>
                홈페이지 · 유료광고
              </h3>
              <div className="space-y-0.5 md:space-y-1 text-xs md:text-sm">
                <div>게시판문의</div>
                <div>상담신청</div>
                <div>자가진단</div>
                <div>메일</div>
                <div>팝업창</div>
                <div>캠페인신청_폼</div>
                <div>구홈_자가</div>
                <div>구홈_상담신청</div>
                <div>구홈_게시판</div>
                <div>메인홈페이지_8230</div>
                <div>구홈페이지</div>
                <div>메인홈페이지</div>
                <div>서울플레이스_5059</div>
                <div>부산플레이스_1970</div>
                <div>파워컨텐츠_2383</div>
                <div>세모특허원페이지_5710</div>
                <div>파워컨텐츠</div>
                <div>서울플레이스</div>
                <div>부산플레이스</div>
                <div>세모특허원페이지</div>
                <div>플레이스_예약</div>
                <div>세모특허원페이지_폼</div>
              </div>
            </div>

            {/* 바이럴 */}
            <div className="border rounded-lg p-3 md:p-4" style={{ backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', borderColor: '#10b981' }}>
              <h3 className="font-bold mb-2 md:mb-3 text-center pb-2 border-b text-sm md:text-base" style={{ color: '#10b981' }}>
                바이럴
              </h3>
              <div className="space-y-0.5 md:space-y-1 text-xs md:text-sm">
                <div>shp블로그_6571</div>
                <div>gem블로그_3678</div>
                <div>jnin블로그_1016</div>
                <div>woo블로그_2373</div>
                <div>koo블로그_5317</div>
                <div>tor블로그_4194</div>
                <div>khai블로그_2726</div>
                <div>lang블로그_4786</div>
                <div>자동화카페B_3816</div>
                <div>icarus블로그_3452</div>
                <div>자동화블로그(영)_1812</div>
                <div>자동화블로그(영2)_4194</div>
                <div>자동화블로그(승)_4283</div>
                <div>자동화블로그(언)_3193</div>
                <div>자동화테스트(백)_3734</div>
                <div>자동화카페A_4346</div>
                <div>자동화카페B_3987</div>
                <div>수원자동화블/카_5913</div>
                <div>백상희지식인_2152</div>
                <div>윤웅채지식인_4246</div>
                <div>김신연지식인_2526</div>
                <div>이상담지식인_3579</div>
                <div>new티스토리_3630</div>
                <div>고객인터뷰폼_3816</div>
                <div>소책자_3193</div>
                <div>자동화블로그A_4746</div>
                <div>shp블_폼</div>
                <div>shp블_댓글/메일</div>
                <div>자동화카페(A)_폼</div>
                <div>자동화카페(B)_폼</div>
                <div>gem블_댓글/메일</div>
                <div>jnin블_댓글/메일</div>
                <div>woo블_댓글/메일</div>
                <div>koo블_댓글/메일</div>
                <div>lang블_댓글/메일</div>
                <div>jnin블_업무폰</div>
                <div>woo블_폼</div>
                <div>koo블_업무폰</div>
                <div>lang블_폼</div>
                <div>shp블로그</div>
                <div>gem블로그</div>
                <div>jnin블로그</div>
                <div>woo블로그</div>
                <div>koo블로그</div>
                <div>tor블로그</div>
                <div>khai블로그</div>
                <div>lang블로그</div>
                <div>dlk블로그</div>
                <div>icarus블로그</div>
                <div>자동화블로그(영)</div>
                <div>자동화블로그(영2)</div>
                <div>자동화블로그(승)</div>
                <div>자동화블로그(언)</div>
                <div>자동화블로그(백)</div>
                <div>자동화카페A</div>
                <div>자동화카페B</div>
                <div>수원자동화블/카</div>
                <div>백상희지식인</div>
                <div>김신연지식인</div>
                <div>윤웅채지식인</div>
                <div>이상담지식인</div>
                <div>new티스토리</div>
                <div>자동화블로그A</div>
                <div>자동화블로그A_폼</div>
              </div>
            </div>

            {/* 기타 */}
            <div className="border rounded-lg p-3 md:p-4" style={{ backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)', borderColor: '#f59e0b' }}>
              <h3 className="font-bold mb-2 md:mb-3 text-center pb-2 border-b text-sm md:text-base" style={{ color: '#f59e0b' }}>
                기타
              </h3>
              <div className="space-y-0.5 md:space-y-1 text-xs md:text-sm">
                <div>기타</div>
                <div>카카오_예약</div>
                <div>번호추적불가</div>
                <div>카카오플레이스_4909</div>
                <div>유튜브_1737</div>
                <div>공식블로그</div>
                <div>공식블로그_4247</div>
                <div>카카오플레이스</div>
                <div>유튜브</div>
                <div>기타경로</div>
              </div>
            </div>

            {/* 문의건X */}
            <div className="border rounded-lg p-3 md:p-4" style={{ backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', borderColor: '#8b5cf6' }}>
              <h3 className="font-bold mb-2 md:mb-3 text-center pb-2 border-b text-sm md:text-base" style={{ color: '#8b5cf6' }}>
                문의건X
              </h3>
              <div className="space-y-0.5 md:space-y-1 text-xs md:text-sm">
                <div>연락처중복</div>
                <div>문의외수임</div>
                <div>crm메일</div>
                <div>리마인드CRM</div>
                <div>직통문의</div>
                <div>타법인전달</div>
              </div>
            </div>
          </div>

            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 문의건 카운트 로직 (항상 표시) */}
      <div className="p-3 md:p-4 bg-muted rounded-lg">
        <h4 className="font-semibold mb-2 text-sm md:text-base">📋 문의건 카운트 로직</h4>
        <ul className="space-y-1 text-xs md:text-sm text-muted-foreground">
          <li>• <strong>완전 제외:</strong> E열 = "AI응대", "문의건X", "특허관리팀전달"</li>
          <li>• <strong>중복 제거:</strong> E열 = "리마인드CRM", "연락처중복" → 같은 달 내 H열 중복 시 1건</li>
          <li>• <strong>일반 카운트:</strong> 위 조건 외 모든 문의건</li>
        </ul>
      </div>
    </div>
  )
}