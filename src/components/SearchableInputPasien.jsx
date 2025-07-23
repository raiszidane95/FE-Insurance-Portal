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

export function SearchPasien({ initValue, placeholder, searchPlaceholder, notFoundMessage, moduleApiUrl, className, selectedValue, filter }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [data, setData] = React.useState([]);

  const handleFetch = async ({ search }) => {
    try {
      const result = await fetchFunction({ search, moduleApiUrl });
      setData((prevData) => {
        // Pastikan initValue tetap ada jika belum masuk result
        if (initValue && !result.data.some(item => item.No_MR === initValue.No_MR)) {
          return [initValue, ...result.data];
        }
        return result.data;
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 🟡 Set default value jika initValue ada
  React.useEffect(() => {
    if (initValue?.No_MR) {
      setValue(initValue.No_MR);
      setData((prev) => {
        if (!prev.some(item => item.No_MR === initValue.No_MR)) {
          return [initValue, ...prev];
        }
        return prev;
      });
    }
  }, [initValue]);

  // 🟡 Fetch saat user search
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm) {
        handleFetch({ search: searchTerm });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);


  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen && data.length === 0) {
          handleFetch({ search: "" });
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
            {value
              ? data.find((item) => item.No_MR === value)?.No_MR + " | " + data.find((item) => item.No_MR === value)?.Nama_Pasien
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} onValueChange={(text) => setSearchTerm(text)} />
          <CommandList>
            <CommandEmpty>{notFoundMessage || "No item found."}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.No_MR}
                  value={`${item.No_MR} ${item.Nama_Pasien}`}
                  onSelect={() => {
                    setValue(item.No_MR);
                    selectedValue(item);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item.No_MR ? "opacity-100" : "opacity-0")} />
                  {item.No_MR} | {item.Nama_Pasien}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
