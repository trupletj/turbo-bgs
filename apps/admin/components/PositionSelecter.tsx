"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { companies, departments, divisions, positions } from "@/lib/data";

const PositionSelector = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [checkedPositions, setCheckedPositions] = useState<string[]>([]);

  // Энд positions өгөгдлийг гаднаас авах шаардлагагүй
  const filteredPositions = positions.filter((position) => {
    if (selectedDivision) {
      return position.divisionId === selectedDivision; // Сонгогдсон тасагт тохирох ажлын байр
    }
    return true;
  });

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    setSelectedDepartment(null); // Reset department when company changes
    setSelectedDivision(null); // Reset division when company changes
  };

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setSelectedDivision(null); // Reset division when department changes
  };

  const handleDivisionChange = (divisionId: string) => {
    setSelectedDivision(divisionId);
  };

  const handlePositionChange = (positionId: string, checked: boolean) => {
    setCheckedPositions((prevChecked) =>
      checked
        ? [...prevChecked, positionId]
        : prevChecked.filter((id) => id !== positionId)
    );
  };

  return (
    <div className="flex">
      <div>
        <label>Компани:</label>
        <select onChange={(e) => handleCompanyChange(e.target.value)}>
          <option value="">Сонгоно уу</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCompany && (
        <div>
          <label>Хэлтэс:</label>
          <select onChange={(e) => handleDepartmentChange(e.target.value)}>
            <option value="">Сонгоно уу</option>
            {departments
              .filter((dept) => dept.companyId === selectedCompany)
              .map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {selectedDepartment && (
        <div>
          <label>Тасаг:</label>
          <select onChange={(e) => handleDivisionChange(e.target.value)}>
            <option value="">Сонгоно уу</option>
            {divisions
              .filter(
                (division) => division.departmentId === selectedDepartment
              )
              .map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {selectedDivision && (
        <div>
          <label>Ажлын байр:</label>
          <div>
            {filteredPositions.map((position) => (
              <div key={position.id} className="flex items-center gap-2">
                <Checkbox
                  checked={checkedPositions.includes(position.id)}
                  onCheckedChange={(checked) =>
                    handlePositionChange(position.id, checked as boolean)
                  }
                />
                <span>{position.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionSelector;
