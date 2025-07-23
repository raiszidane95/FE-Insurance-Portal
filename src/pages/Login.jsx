import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ShieldCheck, User } from "lucide-react"
import { LoginApi } from "@/service/api"
import { useState } from "react"
import Swal from "sweetalert2"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [inputForm, setInputForm] = useState({ Username: '', Password: '' })

  const fetchLogin = async () => {
    try {
      const response = await LoginApi(inputForm);
      if (response?.status == 200) {
        localStorage.setItem("token", response?.data?.token);
        Swal.fire("Success", response?.message, "success").then(() => {
          setTimeout(() => {
            localStorage.removeItem("agreement");
          })
          window.location.href = "/";
        });
      } else {
        Swal.fire("Error", response?.message, "error");
        return
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit =  (e) => {
    e.preventDefault();
    fetchLogin();
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
      <Card className="mx-auto max-w-sm w-full ">
        <CardHeader className="space-y-1 text-center bg-primaryBlue text-primary-foreground p-6 rounded-t-lg">
          <div className="flex justify-center">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl">Portal Asuransi <br />RS Urip Sumoharjo</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Login untuk mengakses portal asuransi Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Username</Label>
              <Input id="email" type="text" placeholder="Username" required onChange={(e) => setInputForm({ ...inputForm, Username: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="ml-auto inline-block text-sm underline">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={inputForm.Password}
                  onChange={(e) =>
                    setInputForm({ ...inputForm, Password: e.target.value })
                  }
                  className="pr-10" // memberi ruang buat icon
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <Button onClick={handleSubmit} type="submit" className="w-full bg-primaryBlue hover:bg-primaryBlue/80">
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
