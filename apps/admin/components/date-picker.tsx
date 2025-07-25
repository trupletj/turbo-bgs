"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  onDateChange,
}: {
  onDateChange: (date: Date | null) => void;
}) {
  const [date, setDate] = React.useState<Date | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (date: Date) => {
    // Зөвхөн огноо, цагийн зөрүүг засах
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );

    // Огноог local time-тай тохируулах
    setDate(adjustedDate);
    onDateChange(adjustedDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {date ? format(date, "dd/MM/yyyy") : <span>Огноо сонгох</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          required
          mode="single"
          selected={date ?? undefined}
          onSelect={handleDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
