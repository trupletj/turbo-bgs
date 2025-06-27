"use client";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Building2, Users, Briefcase, User } from "lucide-react";
import {
  job_position as TJobPosition,
  clause_job_position as TClauseJobPosition,
  type_clause_job_position,
} from "@repo/database/generated/prisma/client/client";
import { Button } from "./ui/button";
import {
  OrganizationWithJobRelations,
  HeltesWithJobRelations,
  AlbaWithJobRelations as TAlba,
} from "@/types/organization";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getClauseJobPosition,
  createClauseJobPosition,
  updateClauseJobPosition,
} from "@/action/ClausePositionService";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
interface Props {
  organization: OrganizationWithJobRelations;
}
type Params = { clause_id: string };

export default function OrganizationNode({ organization }: Props) {
  console.log(JSON.stringify(organization.job_position));
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-2 h-auto">
          <ChevronRight
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
          />
          <Building2 className="h-5 w-5 ml-1 mr-2 text-blue-600" />
          <span className="font-semibold text-lg">{organization.name}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-6 mt-2 space-y-2">
        {organization.job_position && organization?.job_position.length > 0 && (
          <div className="ml-4 space-y-1">
            {organization.job_position.map((position) => (
              <PositionNode key={position.id} position={position} />
            ))}
          </div>
        )}

        {organization.heltes.map((helts) => (
          <DepartmentNode key={helts.id} department={helts} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function PositionNode({ position }: { position: TJobPosition }) {
  const [data, setData] = useState<TClauseJobPosition | null>(null);
  const { clause_id } = useParams<Params>();
  const actionTypes: { value: type_clause_job_position; label: string }[] = [
    { value: "IMPLEMENTATION", label: "Хэрэгжүүлэлт" },
    { value: "MONITORING", label: "Хяналт" },
    { value: "VERIFICATION", label: "Баталгаажуулалт" },
    { value: "DEPLOYMENT", label: "Нэвтрүүлэлт" },
  ];
  const handleTypeChange = async (value: type_clause_job_position) => {
    if (data) {
      const updated = await updateClauseJobPosition({
        id: data.id,
        type: value,
      });
      setData(updated);
      const valueLabel =
        actionTypes.find((type) => type.value === value)?.label ?? value;
      toast.success(
        <span>
          <strong>{valueLabel}</strong> төрөлтэй амжилттай сонгогдлоо
        </span>,
        {
          autoClose: 1500,
        }
      );
    }
  };

  useEffect(() => {
    if (!clause_id || !position?.id) return;

    const fetchOrCreate = async () => {
      const existing = await getClauseJobPosition({
        where: {
          AND: [{ clauseId: clause_id }, { job_positionId: position.id }],
        },
      });
      if (existing) {
        setData(existing);
        return;
      } else {
        setData(null);
      }
    };

    fetchOrCreate();
  }, []);

  const handleCheckChange = async () => {
    if (!clause_id || !position?.id) return;

    if (data) {
      const updated = await updateClauseJobPosition({
        id: data.id,
        is_checked: !data.is_checked,
      });
      setData(updated);
    } else {
      const created = await createClauseJobPosition({
        clauseId: clause_id,
        job_positionId: position.id,
        is_checked: true,
        type: type_clause_job_position.IMPLEMENTATION,
      });
      setData(created);
      toast.success("Хэрэгжүүлэлт төрөлтэй сонгогдлоо.", {
        autoClose: 1000, // 3000ms = 3 секунд
      });
    }
  };

  return (
    <div className="flex items-center p-2 ml-4 rounded-md hover:bg-muted/50">
      <Checkbox
        checked={data?.is_checked}
        onCheckedChange={handleCheckChange}
        className="border-gray-300 hover:border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mr-2"
      />
      <User className="h-3 w-3 mr-2 text-gray-500" />
      <span className="text-sm">{position.name}</span>
      {data?.is_checked && (
        <Select
          onValueChange={(val) =>
            handleTypeChange(val as type_clause_job_position)
          }
          defaultValue={data?.type ?? undefined}
          value={data?.type ?? undefined}
        >
          <SelectTrigger className="ml-2 w-[220px] border-gray-300">
            <SelectValue placeholder="Төрөл сонгох" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Хэрэгжүүлэлтийн төрөл</SelectLabel>
              {actionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

function DepartmentNode({
  department,
}: {
  department: HeltesWithJobRelations;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-2 h-auto">
          <ChevronRight
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
          />
          <Users className="h-4 w-4 ml-1 mr-2 text-green-600" />
          <span className="font-medium">{department.name}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-6 mt-2 space-y-2">
        {department.job_position && department.job_position.length > 0 && (
          <div className="ml-4 space-y-1">
            {department.job_position.map((position) => (
              <PositionNode key={position.id} position={position} />
            ))}
          </div>
        )}

        {department.alba &&
          department.alba.map((division) => (
            <DivisionNode key={division.id} division={division} />
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function DivisionNode({ division }: { division: TAlba }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-2 h-auto">
          <ChevronRight
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
          />
          <Briefcase className="h-4 w-4 ml-1 mr-2 text-purple-600" />
          <span className="font-medium text-sm">{division.name}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-6 mt-2 space-y-1">
        {division.job_position.map((position) => (
          <PositionNode key={position.id} position={position} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
