import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const apiUrl = import.meta.env.VITE_URL;
const token = localStorage.getItem("token");

const fetchFunction = async ({ search, moduleApiUrl }) => {
  const response = await fetch(`${apiUrl}/${moduleApiUrl}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ keyword: search }),
    method: "POST",
    cache: "no-store",
  });

  return await response.json();
};

export function SearchProviderRujukan({ placeholder, searchPlaceholder, notFoundMessage, moduleApiUrl, className, selectedValue }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [data, setData] = React.useState([]);

  const handleFetch = async ({ search }) => {
    try {
      const result = await fetchFunction({ search, moduleApiUrl });
      setData(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm) {
        handleFetch({ search: searchTerm || "" });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  React.useEffect(() => {
    handleFetch({ search: "" });
  }, []);

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen && data.length >= 1) {
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
            {value ? data.find((item) => item.KDPROVIDER === value)?.KDPROVIDER + " | " + data.find((item) => item.KDPROVIDER === value)?.NMPROVIDER : placeholder}
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
              {data.map((item,) => (
                <CommandItem
                  key={item.KDPROVIDER}
                  value={`${item.KDPROVIDER} ${item.NMPROVIDER}`}
                  onSelect={(currentValue) => {
                    setValue(item.KDPROVIDER);
                    selectedValue(item);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item.KDPROVIDER ? "opacity-100" : "opacity-0")} />
                  {item.KDPROVIDER} | {item.NMPROVIDER}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}