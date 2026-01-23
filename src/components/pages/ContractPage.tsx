import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { useState, useMemo, useEffect } from "react"
import { CheckCircle2 } from "lucide-react"
import { ContractData } from "../../types"
import { filterBySource } from "../../lib/googleSheets"

interface ContractPageProps {
  subPage?: string
  contracts: ContractData[]
}

export function ContractPage({ subPage, contracts }: ContractPageProps) {
  // D열(접수유형) 데이터에서 유니크한 값들 추출
  const contractTypes = useMemo(() => {
    const types = new Set<string>()
    types.add("전체") // 전체 탭 추가
    contracts.forEach(contract => {
      if (contract.receiptType) { // source → receiptType으로 변경
        types.add(contract.receiptType)
      }
    })
    return Array.from(types).sort()
  }, [contracts])

  const [activeTab, setActiveTab] = useState(subPage || "전체")

  // subPage가 변경되면 activeTab 업데이트
  useEffect(() => {
    if (subPage) {
      setActiveTab(subPage)
    }
  }, [subPage])

  // 접수유형별로 필터링된 수임 데이터
  const filteredContracts = useMemo(() => {
    if (activeTab === "전체") return contracts
    return contracts.filter(c => c.receiptType === activeTab)
  }, [contracts, activeTab])

  // 전체 통계
  const totalStats = useMemo(() => {
    // 전체 수임건
    const totalContracts = contracts.length
    // 현재 선택된 매체의 수임건
    const mediaContracts = filteredContracts.length
    
    // 분야별 수임 차지율 계산 (Top 3)
    const fieldCounts = new Map<string, number>()
    filteredContracts.forEach(contract => {
      const field = contract.type || "기타"
      fieldCounts.set(field, (fieldCounts.get(field) || 0) + 1)
    })
    
    // Top 3 분야 추출
    const topFields = Array.from(fieldCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([field, count]) => ({
        field,
        count,
        percentage: mediaContracts > 0 ? ((count / mediaContracts) * 100).toFixed(1) : "0.0"
      }))
    
    return { 
      totalContracts,
      mediaContracts,
      topFields
    }
  }, [contracts, filteredContracts])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      "완료": "default",
      "진행중": "secondary",
      "계약": "outline"
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-3 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">수임 관리</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          수임 내역 및 계약 현황을 확인하세요
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {contractTypes.map((type) => (
          <Button
            key={type}
            variant={activeTab === type ? "default" : "outline"}
            onClick={() => setActiveTab(type)}
            size="sm"
            className="text-xs md:text-sm"
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">총 수임건</CardTitle>
            <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl md:text-2xl font-bold">{totalStats.totalContracts.toLocaleString()}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              전체 수임 건수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">매체 수임건</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl md:text-2xl font-bold">{totalStats.mediaContracts.toLocaleString()}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              {activeTab} 매체 수임
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">분야별 수임 차지율</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {totalStats.topFields.length > 0 ? (
                totalStats.topFields.map((field, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-[10px] md:text-sm text-muted-foreground">{field.field}</span>
                    <span className="text-[10px] md:text-sm font-medium">{field.percentage}%</span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] md:text-sm text-muted-foreground">데이터 없음</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">평균 수임금액</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg md:text-2xl font-bold">
              ₩{filteredContracts.length > 0
                ? Math.floor(
                    filteredContracts.reduce((sum, c) => {
                      const amount = typeof c.amount === 'string'
                        ? parseInt(c.amount.replace(/,/g, '')) || 0
                        : c.amount || 0
                      return sum + amount
                    }, 0) / filteredContracts.length
                  ).toLocaleString()
                : '0'
              }
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              건당 평균 금액
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg">{activeTab} 수임 내역</CardTitle>
          <CardDescription className="text-xs md:text-sm">최근 수임 계약 내역을 확인하세요</CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">수임번호</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden sm:table-cell">문의날짜</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">수임날짜</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">시간</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">분야</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">성함</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden md:table-cell">연락처</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden lg:table-cell max-w-[200px]">이메일</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden md:table-cell">담당 변리사</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">수임금액</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden sm:table-cell">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.length > 0 ? (
                  filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">{contract.id}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap hidden sm:table-cell">{contract.inquiryDate || contract.date}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">{contract.contractDate || '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">{contract.time || '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">{contract.type || '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">{contract.customerName || '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap hidden md:table-cell">{contract.phone || '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm hidden lg:table-cell max-w-[200px] truncate" title={contract.email || '-'}>
                        {contract.email || '-'}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap hidden md:table-cell">{contract.attorney ? `${contract.attorney} 변리사님` : '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">{contract.amount ? `₩${contract.amount.toLocaleString()}` : '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm hidden sm:table-cell">{getStatusBadge(contract.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-muted-foreground py-6 md:py-8 text-xs md:text-sm">
                      {activeTab} 출처의 수임 데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}