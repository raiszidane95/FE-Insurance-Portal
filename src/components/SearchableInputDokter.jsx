import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const apiUrl = import.meta.env.VITE_URL;
const token = localStorage.getItem("token");

const fetchFunction = async ({ search, moduleApiUrl }) => {
  const response = await fetch(`${apiUrl}/${moduleApiUrl}?search=${search}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });

  return await response.json();
};

export function SearchDokter({ placeholder, searchPlaceholder, notFoundMessage, moduleApiUrl, className, selectedValue }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const handleFetch = async ({ search }) => {
    try {
      setLoading(true);
      const result = await fetchFunction({ search, moduleApiUrl });
      setData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleFetch({ search: "" });
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm) {
        handleFetch({ search: searchTerm || "" });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  React.useEffect(() => {
    setData([]);
  }, []);


  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen && data.length === 0) {
        handleFetch({ search: "" });
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
        >
          {value
            ? data.find((item) => item.Kode_Dokter === value)?.Kode_Dokter + " | " +
            data.find((item) => item.Kode_Dokter === value)?.Nama_Dokter
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} onValueChange={(text) => setSearchTerm(text)} />
          <CommandList>
            <CommandEmpty>{notFoundMessage || "No item found."}</CommandEmpty>
            <CommandGroup>
              {loading ? <p>Loading...</p> : data?.map((item) => (
                <CommandItem
                  key={item.Kode_Dokter}
                  value={`${item.Kode_Dokter} ${item.Nama_Dokter}`}
                  onSelect={(currentValue) => {
                    setValue(item.Kode_Dokter);
                    selectedValue(item);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item.Kode_Dokter ? "opacity-100" : "opacity-0")} />
                  {item.Kode_Dokter} | {item.Nama_Dokter}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}