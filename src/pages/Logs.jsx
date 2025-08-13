import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { logs } from "@/service/api"
import { useEffect, useState } from "react"

export default function LogsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await logs();
      setData(response?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>Daftar logs</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            data.map((item, index) => (
              <div key={index}>
                <p className="text-md text-muted-foreground">{item}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
