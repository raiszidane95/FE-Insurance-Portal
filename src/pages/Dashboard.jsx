import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import React from "react"
import { cetakSJP, listSJP } from "@/service/api"
import { DropdownAksi } from "@/components/DropdownAksi"
import PdfViewer from "@/components/PdfViewer"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@material-tailwind/react"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocation, useNavigate } from "react-router-dom"
import { formatedDate } from "@/Util/date"
export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultSJP = location.state;
  const [data, setData] = React.useState([]);
  const [byteData, setByteData] = React.useState(null);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const continueCetak = async () => {
    setOpenDrawer(true);
    setLoading(true);
    try {
      const response = await cetakSJP({ No_SJP: resultSJP.data.No_SJP });
      setByteData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await listSJP();
        setData(response?.data);
      } catch (error) {
        setData([]);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
  if (resultSJP?.data) {
    continueCetak();

    navigate(location.pathname, { replace: true });
  }
}, [resultSJP, navigate, location.pathname]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Selamat Datang Kembali!</h1>
        <p className="text-muted-foreground">Berikut adalah ringkasan aktivitas portal Anda.</p>
      </div>
      {/* Klaim */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Klaim Terbaru</CardTitle>
          <CardDescription>Daftar klaim yang baru-baru ini diajukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[50px]">Aksi</TableHead>
                <TableHead>Nomor Register</TableHead>
                <TableHead>Nomor SJP</TableHead>
                <TableHead>Jenis Asuransi</TableHead>
                <TableHead>Nama Asuransi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length > 0 ? data.map((item) => (
                <TableRow key={item.id}>
                  {/* Aksi */}
                  <TableCell>
                    <DropdownAksi item={item} setByteData={setByteData} setOpenDrawer={setOpenDrawer} setLoading={setLoading} />
                  </TableCell>

                  {/* Nomor Register */}
                  <TableCell>
                    <div className="font-medium">{item.PENDAFTARAN.No_Reg}</div>
                  </TableCell>

                  {/* Nomor SJP */}
                  <TableCell>
                    <div className="font-medium">{item.No_SJP}</div>
                  </TableCell>
                  
                  {/* Jenis Asuransi */}
                  <TableCell>
                    <div className="font-medium">{item.IP_ASURANSI?.Jenis_Asuransi || "-"}</div>
                  </TableCell>
                  
                  {/* Nama Asuransi */}
                  <TableCell>
                    <div className="font-medium">{item.IP_ASURANSI?.Nama_Asuransi || "-"}</div>
                  </TableCell>

                  {/* Nomor Tanggal */}
                  <TableCell>{formatedDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-green-600 text-green-600">
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )): (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Drawer */}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="h-[80vh] p-4">
          <DrawerHeader>
            <DrawerTitle>Preview PDF</DrawerTitle>
          </DrawerHeader>
          {
            <div className="overflow-auto h-full">
              {loading ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-[18vh] w-full" />
                  <Skeleton className="h-[18vh] w-full" />
                  <Skeleton className="h-[18vh] w-full" />
                </div>
              ) : byteData?.BYTEDATA ? (
                <PdfViewer base64data={byteData.BYTEDATA} />
              ) : (
                <p className="text-center text-muted-foreground">Tidak ada file untuk ditampilkan.</p>
              )}
            </div>
          }
          <div className="p-4 flex justify-end">
            <DrawerClose asChild>
              <Button variant="outline">Tutup</Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
