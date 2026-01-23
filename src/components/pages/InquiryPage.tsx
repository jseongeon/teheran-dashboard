import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { useState, useMemo, useEffect } from "react"
import { InquiryData } from "../../types"
import { countInquiries } from "../../lib/googleSheets"

interface InquiryPageProps {
  subPage?: string
  inquiries: InquiryData[]
}

export function InquiryPage({ subPage, inquiries }: InquiryPageProps) {
  // D열(접수유형) 데이터에서 유니크한 값들 추출
  const inquiryTypes = useMemo(() => {
    const types = new Set<string>()
    inquiries.forEach(inquiry => {
      if (inquiry.receiptType) {
        types.add(inquiry.receiptType)
      }
    })
    return Array.from(types).sort()
  }, [inquiries])

  const [activeTab, setActiveTab] = useState(subPage || (inquiryTypes[0] || "전체"))

  // subPage가 변경되면 activeTab 업데이트
  useEffect(() => {
    if (subPage) {
      setActiveTab(subPage)
    }
  }, [subPage])

  // 출처별로 필터링된 문의 데이터 (D열 기준)
  const filteredInquiries = useMemo(() => {
    if (activeTab === "전체") return inquiries
    return inquiries.filter(i => i.receiptType === activeTab)
  }, [inquiries, activeTab])

  // 문의건 카운트 (중복 제거 로직 적용)
  const inquiryCount = useMemo(() => {
    return countInquiries(filteredInquiries)
  }, [filteredInquiries])

  // 전체 통계 - 총문의건, 매체문의건, 수임완료, 수임률
  const totalStats = useMemo(() => {
    // 전체 문의건 카운트 (중복 제거 로직 적용)
    const totalInquiries = countInquiries(inquiries)
    // 현재 선택된 매체(탭)의 문의건 카운트
    const mediaInquiries = countInquiries(filteredInquiries)
    // 수임완료 건수 (필터링된 데이터 기준)
    const completedContracts = filteredInquiries.filter(i => i.isContract === true).length
    // 수임률 계산 (매체문의건 기준)
    const contractRate = mediaInquiries > 0 ? ((completedContracts / mediaInquiries) * 100).toFixed(1) : "0.0"
    
    return { 
      totalInquiries, 
      mediaInquiries, 
      completedContracts, 
      contractRate 
    }
  }, [inquiries, filteredInquiries])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      "완료": "default",
      "처리중": "secondary",
      "대기": "outline"
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-3 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">문의 관리</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          고객 문의 내역을 확인하고 관리하세요
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {inquiryTypes.map((type) => (
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
            <CardTitle className="text-xs md:text-sm font-medium">총 문의건</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl md:text-2xl font-bold">{totalStats.totalInquiries.toLocaleString()}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              전체 문의 건수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">매체 문의건</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl md:text-2xl font-bold">{totalStats.mediaInquiries.toLocaleString()}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              {activeTab} 매체 문의
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">수임 완료</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl md:text-2xl font-bold">{totalStats.completedContracts.toLocaleString()}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              수임으로 전환된 건
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">수임률</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl md:text-2xl font-bold">{totalStats.contractRate}%</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              문의 대비 수임 비율
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg">{activeTab} 문의 내역</CardTitle>
          <CardDescription className="text-xs md:text-sm">최근 문의 내역을 확인하세요</CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">문의번호</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">날짜</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden sm:table-cell">시간</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">분야</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">성함</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden md:table-cell">연락처</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden lg:table-cell max-w-[200px]">이메일</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden md:table-cell">담당 변리사</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">리마인드</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">{inquiry.id}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">{inquiry.date}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap hidden sm:table-cell">{inquiry.time || '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">{inquiry.type || '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">{inquiry.customerName || '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap hidden md:table-cell">{inquiry.phone || '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm hidden lg:table-cell max-w-[200px] truncate" title={inquiry.email || '-'}>
                        {inquiry.email || '-'}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap hidden md:table-cell">{inquiry.attorney ? `${inquiry.attorney} 변리사님` : '-'}</TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">
                        {inquiry.isReminder ? 'True' : 'False'}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm">{getStatusBadge(inquiry.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-6 md:py-8 text-xs md:text-sm">
                      {activeTab} 출처의 문의 데이터가 없습니다.
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