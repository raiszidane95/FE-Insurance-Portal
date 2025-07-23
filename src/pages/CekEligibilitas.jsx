import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SearchAsuransi } from "@/components/SearchableInputAsuransi" // Asumsi komponen ini ada
import { CekEligibilitasApi, ListPoliInhealth } from "@/service/api" // Asumsi API service ada

import { ShieldCheck, CreditCard, Stethoscope, ListChecks, Loader2, XCircle } from "lucide-react"

// Helper component untuk form field yang lebih rapi
const FormField = ({ label, icon, children }) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2 text-base font-medium text-gray-700">
      {icon}
      {label}
    </Label>
    {children}
  </div>
)

export default function CekEligibilitasPage() {
  const navigate = useNavigate()
  const [isEligible, setIsEligible] = useState(null)
  const [input, setInput] = useState({ nokainhealth: "", jenispelayanan: "", poli: "", Rekanan: "" })
  const [data, setData] = useState({ data: [] })
  const [dataPoli, setDataPoli] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isPoliLoading, setIsPoliLoading] = useState(true)

  const fetchEligibilitas = async () => {
    if (input.Rekanan === "") {
      Swal.fire("Perhatian", "Silakan pilih jenis asuransi terlebih dahulu.", "warning");
      return;
    }
    if (!input.nokainhealth || !input.jenispelayanan || !input.poli) {
      Swal.fire("Perhatian", "Harap lengkapi semua kolom yang diperlukan.", "warning");
      return;
    }

    try {
      setIsLoading(true)
      const response = await CekEligibilitasApi(input)
      setData(response)
      if (response.status === 200) {
        setIsEligible(true)
        Swal.fire({
          title: "Berhasil!",
          text: "Pasien memenuhi syarat untuk melanjutkan.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/simpan-sjp", { state: input })
        })
      } else {
        setIsEligible(false)
      }
    } catch (error) {
      console.error(error)
      setIsEligible(false)
      Swal.fire("Error", "Terjadi kesalahan saat memeriksa eligibilitas.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPoli = async () => {
    try {
      setIsPoliLoading(true)
      const response = await ListPoliInhealth()
      setDataPoli(response)
    } catch (error) {
      console.error(error)
    } finally {
      setIsPoliLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchEligibilitas()
  }

  useEffect(() => {
    fetchPoli()
  }, [])

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-primaryBlue text-primary-foreground p-6">
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-10 w-10" />
            <div>
              <CardTitle className="text-2xl">Cek Eligibilitas Asuransi</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Pastikan data pasien sesuai untuk melanjutkan proses.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField label="Jenis Asuransi" icon={<ShieldCheck className="h-5 w-5 text-primary" />}>
                <SearchAsuransi
                  selectedValue={(data) => setInput({ ...input, Rekanan: data })}
                  moduleApiUrl={"insurance-list"}
                  placeholder="Pilih Jenis Asuransi"
                  searchPlaceholder="Cari Nama/kode..."
                  notFoundMessage="Asuransi tidak ditemukan."
                />
              </FormField>

              <FormField label="Nomor Kartu Asuransi" icon={<CreditCard className="h-5 w-5 text-primary" />}>
                <Input
                  type="number"
                  placeholder="Contoh: 000123456789"
                  required
                  onChange={(e) => setInput({ ...input, nokainhealth: e.target.value })}
                  className="text-base"
                />
              </FormField>

              <FormField label="Jenis Pelayanan" icon={<ListChecks className="h-5 w-5 text-primary" />}>
                <Select required onValueChange={(value) => setInput({ ...input, jenispelayanan: value })}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Pilih jenis pelayanan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RAWAT JALAN">Rawat Jalan</SelectItem>
                    <SelectItem value="RAWAT INAP">Rawat Inap</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Poli Tujuan" icon={<Stethoscope className="h-5 w-5 text-primary" />}>
                <Select required onValueChange={(value) => setInput({ ...input, poli: value })}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder={isPoliLoading ? "Memuat poli..." : "Pilih poli"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isPoliLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Memuat...</span>
                      </div>
                    ) : (
                      <>
                        {dataPoli?.data?.map((poli, index) => (
                          <SelectItem key={index} value={poli.KDPOLI}>
                            {poli.NMPOLI}
                          </SelectItem>
                        ))}
                        <SelectItem value="UGD">IGD</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {isEligible === false && (
              <div className="mt-8">
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <XCircle className="h-5 w-5" />
                  <AlertTitle className="font-bold">Mohon Maaf, Pasien Belum Memenuhi Syarat</AlertTitle>
                  <AlertDescription>
                    {data?.data?.ERRORDESC
                      ? data.data.ERRORDESC
                      : "Silakan periksa kembali data yang dimasukkan atau hubungi pihak asuransi."}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 p-6 flex justify-end">
            <Button type="submit" className="w-36 h-12 text-md bg-primaryBlue" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Mengecek...
                </>
              ) : (
                "Cek Eligibilitas"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
