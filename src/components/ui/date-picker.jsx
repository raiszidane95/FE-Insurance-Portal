import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ onDateChange }) {
  const [date, setDate] = React.useState();

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    onDateChange?.(format(new Date(), 'yyyy-MM-dd'));
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pilih tanggal rujukan</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} disabled={(date) => date > new Date(new Date().setHours(0, 0, 0, 0))} />
      </PopoverContent>
    </Popover>
  )
}
