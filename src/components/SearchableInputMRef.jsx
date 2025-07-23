import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const apiUrl = import.meta.env.VITE_URL
const token = localStorage.getItem("token")

const fetchFunction = async ({ search, filter, moduleApiUrl }) => {
  const url = `${apiUrl}/${moduleApiUrl}?search=${search}&filter=${filter}`
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  })
  return await response.json()
}

export function SearchMRef({
  placeholder,
  searchPlaceholder,
  notFoundMessage,
  moduleApiUrl,
  className,
  selectedValue,
  filter,
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("") // Menyimpan ID terpilih
  const [selectedItem, setSelectedItem] = React.useState(null) // Menyimpan objek item terpilih
  const [searchTerm, setSearchTerm] = React.useState("")
  const [data, setData] = React.useState([])

  const handleFetch = async ({ search }) => {
    if (!filter) return // Hindari fetch kalau filter belum tersedia
    try {
      const result = await fetchFunction({ search, moduleApiUrl, filter })
      setData(result.data)
    } catch (error) {
      console.error("Fetch error:", error)
    }
  }

  // Fetch awal saat komponen mount atau filter berubah
  React.useEffect(() => {
    handleFetch({ search: "" })
  }, [filter])

  // Fetch berdasarkan pencarian (debounce)
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      handleFetch({ search: searchTerm })
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchTerm])

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen && data.length === 0) {
          handleFetch({ search: "" })
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal max-w-full overflow-hidden", !value && "text-muted-foreground", className)}
        >
          <span className="truncate">
            {selectedItem
              ? `${selectedItem.Id_Referensi} | ${selectedItem.NamaFasyankes}`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={(text) => setSearchTerm(text)}
          />
          <CommandList>
            <CommandEmpty>{notFoundMessage || "No item found."}</CommandEmpty>
            <CommandGroup>
              {data?.map((item) => (
                <CommandItem
                  key={item.Id_Referensi}
                  value={item.Id_Referensi}
                  onSelect={() => {
                    setValue(item.Id_Referensi)
                    setSelectedItem(item)
                    selectedValue?.(item)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value === item.Id_Referensi ? "opacity-100" : "opacity-0")}
                  />
                  {item.Id_Referensi} | {item.NamaFasyankes}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}