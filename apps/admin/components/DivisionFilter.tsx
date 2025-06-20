"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companies, departments, divisions, positions } from "@/lib/data";
import PositionSelector from "./PositionSelecter";

interface DivisionFilterProps {
  selectedDivision: string | null;
  onDivisionChange: (divisionId: string) => void;
  onPositionFilter: (filteredPositions: { id: string; name: string }[]) => void;
}

export default function DivisionFilter({
  selectedDivision,
  onDivisionChange,
  onPositionFilter,
}: DivisionFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Албаны бүрэн нэр (компани > хэлтэс > алба)
  const getDivisionDisplayName = (divisionId: string) => {
    const division = divisions.find((d) => d.id === divisionId);
    if (!division) return "";
    const department = departments.find(
      (dept) => dept.id === division.departmentId
    );
    const company = companies.find((comp) => comp.id === department?.companyId);
    return `${company?.name} > ${department?.name} > ${division.name}`;
  };

  // Ажлын байр шүүх
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!selectedDivision) {
      onPositionFilter([]);
      return;
    }
    const filtered = positions.filter(
      (p) =>
        p.divisionId === selectedDivision &&
        p.name.toLowerCase().includes(term.toLowerCase())
    );
    onPositionFilter(filtered);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Ажлын байр холбох
      </label>
      {/* <Select onValueChange={onDivisionChange} value={selectedDivision || ""}>
        <SelectTrigger>
          <SelectValue placeholder="Алба сонгоно уу" />
        </SelectTrigger>
        <SelectContent>
          {divisions.map((division) => (
            <SelectItem key={division.id} value={division.id}>
              {getDivisionDisplayName(division.id)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}
      <PositionSelector />
      {selectedDivision && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ажлын байр хайх
          </label>
          <Input
            placeholder="Ажлын байрны нэрээр хайх..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
      )}
    </div>
  );
}
