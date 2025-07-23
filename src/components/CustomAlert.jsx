// components/FloatingAlert.jsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function FloatingAlert({
  type = "info",
  title,
  description,
  position = "top-right", // "top-left", "bottom-right", "bottom-left"
  className,
}) {
  const icons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
  }

  const styles = {
    info: "border-blue-500 bg-blue-50 text-blue-900",
    success: "border-green-500 bg-green-50 text-green-900",
    warning: "border-yellow-500 bg-yellow-50 text-yellow-900",
    error: "border-red-500 bg-red-50 text-red-900",
  }

  const positionClasses = {
    "top-right": "top-5 right-5",
    "top-center": "top-5 left-1/2 -translate-x-1/2",
    "top-left": "top-5 left-5",
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
  }

  return (
    <div
      className={cn(
        "fixed z-50 max-w-lg shadow-lg",
        positionClasses[position],
        className
      )}
    >
      <Alert className={cn(styles[type])}>
        {icons[type]}
        <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  )
}
