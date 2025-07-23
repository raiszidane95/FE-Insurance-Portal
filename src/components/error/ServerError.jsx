import { useState, useEffect } from "react"
import { AlertTriangle, RefreshCw, Server, ServerOff } from "lucide-react"
import { Button, Card, CardBody, CardFooter, CardHeader } from "@material-tailwind/react"


export default function ServerError() {
  const [showError, setShowError] = useState(true)
  const [errorType, setErrorType] = useState("default")

  const errorConfigs = {
    default: {
      title: "Server Error",
      message: "We're experiencing some issues with our servers. Please try again later.",
      code: 500,
    },
    database: {
      title: "Database Connection Error",
      message: "Tidak dapat terhubung ke database. Silakan coba beberapa saat lagi.",
      code: 503,
    },
    timeout: {
      title: "Request Timeout",
      message: "Permintaan Anda memakan waktu terlalu lama. Silakan periksa koneksi Anda dan coba lagi.",
      code: 408,
    },
  }

  const handleRetry = () => {
    setShowError(false)
    window.location.reload()
  }


  return (
    <div className="space-y-4 p-4">
      {showError && (
        <ServerErrorComponent
          title={errorConfigs[errorType].title}
          message={errorConfigs[errorType].message}
          code={errorConfigs[errorType].code}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}

function ServerErrorComponent({ title, message, code, onRetry }) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Animation effect for the retry button

  const handleRetry = () => {
    setIsAnimating(true)
    if (onRetry) {
      setTimeout(onRetry, 300)
    }
  }
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])


  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md border-[0.1px] border-red-200 bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-gray-800 shadow-lg">
        <CardBody className="pt-4">
          <div className="flex items-center justify-between pt-2 pb-4">
            <div className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {title}
            </div>
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
              Error {code}
            </div>
          </div>
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <ServerOff className="h-20 w-20 text-red-500 dark:text-red-400 opacity-20 absolute" />
              <Server
                className={`h-20 w-20 text-red-500 dark:text-red-400 transition-all duration-500 ${isAnimating ? "scale-110 opacity-80" : "scale-100 opacity-50"
                  }`}
              />
              <div className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-red-400 dark:bg-red-500"></div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 dark:bg-red-400"></div>
            </div>
          </div>
          <p className="text-center text-gray-700 dark:text-gray-300">{message}</p>
        </CardBody>
        <CardFooter className="flex justify-center pb-6">
          <Button
            onClick={handleRetry}
            className={`group flex bg-red-500 hover:bg-red-600 text-white transition-all duration-300 ${isAnimating ? "scale-95" : "scale-100"
              }`}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 transition-transform duration-500 ${isAnimating ? "rotate-180" : "group-hover:rotate-90"
                }`}
            />
            Coba Lagi
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
