"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AttendenceHistory() {
  const [currentMonth, setCurrentMonth] = useState("May")

  const attendanceData = [
    { date: "08", day: "Wed", startTime: "11:08 AM", endTime: "11:09 AM" },
    { date: "22", day: "Wed", startTime: "03:41 PM", endTime: "-" },
    { date: "31", day: "Fri", startTime: "10:35 AM", endTime: "-" },
  ]

  return (
    <div className="   p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm opacity-70">10:35 AM</div>
          <h1 className="text-lg font-medium">Цаг бүртгэл</h1>
        </div>

        {/* Month Selector */}
        <div className="flex items-center  rounded-lg px-3 py-2">
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-3 font-medium">{currentMonth}</span>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-gray-100 border-gray-200">
          <CardContent className="p-2 text-center">
            <div className="text-sm text-slate-700 mb-1">Ажилласан өдөр</div>
            <div className="text-2xl font-bold text-black">1</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-100 border-gray-200">
          <CardContent className="p-2 text-center">
            <div className="text-sm text-slate-700 mb-1">Ажилласан цаг</div>
            <div className="text-2xl font-bold text-black">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <div className="space-y-1">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm text-slate-400 font-medium">
          <div>Date</div>
          <div>Day</div>
          <div>Start Time</div>
          <div>End Time</div>
        </div>

        {/* Table Rows */}
        {attendanceData.map((record, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardContent className="p-0">
              <div className="grid grid-cols-4 gap-4 px-4 py-4 text-sm">
                <div className="font-medium">{record.date}</div>
                <div className="text-slate-300">{record.day}</div>
                <div className="text-slate-300">{record.startTime}</div>
                <div className="text-slate-300">{record.endTime}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
