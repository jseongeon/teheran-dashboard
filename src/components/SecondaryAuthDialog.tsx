import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react"

interface SecondaryAuthDialogProps {
  open: boolean
  onSuccess: () => void
  onCancel: () => void
}

export function SecondaryAuthDialog({ open, onSuccess, onCancel }: SecondaryAuthDialogProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    setTimeout(() => {
      if (password === "1q2w3e4r") {
        onSuccess()
        setPassword("")
        setError("")
      } else {
        setError("비밀번호가 올바르지 않습니다.")
        setPassword("")
      }
      setIsLoading(false)
    }, 300)
  }

  const handleCancel = () => {
    setPassword("")
    setError("")
    onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            2차 인증 필요
          </DialogTitle>
          <DialogDescription>
            세부매체 페이지는 추가 인증이 필요합니다.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="auth-password">비밀번호</Label>
            <div className="relative">
              <Input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-50 dark:text-red-200 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "확인 중..." : "확인"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
