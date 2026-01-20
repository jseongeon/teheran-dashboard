import { 
  BarChart3, 
  Home, 
  PieChart, 
  TrendingUp, 
  Users,
  ChevronRight,
  ChevronDown,
  Target,
  ExternalLink,
  Radio,
  Menu,
  X
} from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "./ui/utils"
import { PageState } from "../App"
import { useState } from "react"

interface NavigationItem {
  title: string
  icon: React.ElementType
  children?: Array<{
    title: string
    externalLink?: string
  }>
}

const navigationItems: NavigationItem[] = [
  {
    title: "홈",
    icon: Home,
    children: [
      {
        title: "포털홈페이지로 이동",
        externalLink: "https://lily-honeydew-416.notion.site/28e4c52da78380e4bee7c782c4aaabbe?source=copy_link"
      },
      {
        title: "메인요약보고서로 이동"
      }
    ]
  },
  {
    title: "실시간",
    icon: TrendingUp
  },
  {
    title: "문의",
    icon: Users,
    children: [
      { title: "홈페이지" },
      { title: "유선" },
      { title: "채팅" },
      { title: "기타" },
      { title: "문의건X" }
    ]
  },
  {
    title: "수임",
    icon: Target,
    children: [
      { title: "홈페이지" },
      { title: "유선" },
      { title: "채팅" },
      { title: "기타" },
      { title: "문의건X" }
    ]
  },
  {
    title: "추가지표",
    icon: BarChart3,
    children: [
      { title: "변리사님별 현황" },
      { title: "분야별 현황" },
      { title: "업무시간 현황" },
      { title: "업무외시간 현황" }
    ]
  },
  {
    title: "세부지표",
    icon: PieChart,
    children: [
      { title: "월 실적" },
      { title: "분기 실적" },
      { title: "연 실적" }
    ]
  },
  {
    title: "세부매체 데이터",
    icon: Radio
  }
  // 디버그 탭 제거
]

interface SidebarProps {
  currentPage: PageState
  setCurrentPage: (page: PageState) => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ currentPage, setCurrentPage, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const handleMainClick = (title: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleExpanded(title)
    } else {
      setCurrentPage({ main: title })
      onMobileClose?.() // 모바일에서 페이지 이동 시 사이드바 닫기
    }
  }

  const handleChildClick = (mainTitle: string, child: { title: string; externalLink?: string }) => {
    if (child.externalLink) {
      window.open(child.externalLink, '_blank')
    } else {
      setCurrentPage({ main: mainTitle, sub: child.title })
      onMobileClose?.() // 모바일에서 페이지 이동 시 사이드바 닫기
    }
  }

  return (
    <>
      {/* 모바일 오버레이 */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* 사이드바 */}
      <div className={cn(
        "w-64 border-r bg-background h-full flex flex-col",
        // 모바일: 고정 위치, 슬라이드 애니메이션
        "fixed md:relative inset-y-0 left-0 z-50",
        "transform transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* 모바일 닫기 버튼 */}
        <div className="md:hidden flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-lg">보고서</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <h2 className="text-lg mb-4 hidden md:block">보고서</h2>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isExpanded = expandedItems.includes(item.title)
              const isActive = currentPage.main === item.title
              
              return (
                <div key={item.title}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      isActive && "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    )}
                    onClick={() => handleMainClick(item.title, !!item.children)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                    {item.children && (
                      isExpanded ? (
                        <ChevronDown className="h-3 w-3 ml-auto" />
                      ) : (
                        <ChevronRight className="h-3 w-3 ml-auto" />
                      )
                    )}
                  </Button>
                  {item.children && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = currentPage.main === item.title && currentPage.sub === child.title
                        
                        return (
                          <Button
                            key={child.title}
                            variant={isChildActive ? "secondary" : "ghost"}
                            size="sm"
                            className={cn(
                              "w-full justify-start text-sm gap-2",
                              isChildActive 
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" 
                                : "text-muted-foreground"
                            )}
                            onClick={() => handleChildClick(item.title, child)}
                          >
                            {child.title}
                            {child.externalLink && (
                              <ExternalLink className="h-3 w-3 ml-auto" />
                            )}
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}