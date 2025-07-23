import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cetakSJP } from "@/service/api";
import { Download, Ellipsis } from "lucide-react"



export function DropdownAksi({ item, setByteData, setOpenDrawer, setLoading }) {

  const fetchCetakSJP = async () => {
    setOpenDrawer(true);
    setLoading(true);
    try {
      const response = await cetakSJP({ No_SJP: item.No_SJP });
      setByteData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  const handleClickCetak = (e) => {
    e.preventDefault();
    fetchCetakSJP();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={handleClickCetak} className="cursor-pointer">
          <Download className="text-leafGreen" />
          Cetak LOA
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
