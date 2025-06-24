"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building, ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Clause } from "@/types/clause";
import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";
import { getAllJobPositions } from "@/action/JobPositionService";
import {
  createClausePositionsWithType,
  deleteClausePosition,
  getClausePositionsByClauseId,
} from "@/action/ClausePositionService";

interface JobPosition {
  id: string;
  bteg_id: string | null;
  name: string | null;
  description: string | null;
  created_at: Date;
}

interface Alba {
  id: string;
  bteg_id: string | null;
  name: string | null;
  sub_title: string | null;
  description: string | null;
}

interface Heltes {
  id: string;
  bteg_id: string | null;
  name: string | null;
  sub_title: string | null;
  description: string | null;
}

interface Organization {
  id: string;
  bteg_id: string;
  name: string;
  sub_title: string | null;
  description: string | null;
}

interface JobPositionStructure {
  organization: Organization;
  structure: Array<{
    heltes: Heltes | null;
    alba: Array<{
      alba: Alba | null;
      positions: JobPosition[];
    }>;
  }>;
}

interface ClauseJobConnectProps {
  clause: {
    id: string;
    referenceNumber: string;
    text: string;
    positions?: { positionId: string; type: type_clause_job_position }[];
  };
  onSave: () => void;
}

const actionTypes: { value: type_clause_job_position; label: string }[] = [
  { value: "IMPLEMENTATION", label: "Хэрэгжүүлэлт" },
  { value: "MONITORING", label: "Хяналт" },
  { value: "VERIFICATION", label: "Баталгаажуулалт" },
  { value: "DEPLOYMENT", label: "Нэвтрүүлэлт" },
];

export default function ClauseJobConnect({
  clause,
  onSave,
}: ClauseJobConnectProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [jobPositions, setJobPositions] = useState<JobPositionStructure[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<
    Record<string, type_clause_job_position>
  >({});
  const [existingPositions, setExistingPositions] = useState<
    Record<string, type_clause_job_position>
  >({});
  const [expandedOrganizations, setExpandedOrganizations] = useState<
    Record<string, boolean>
  >({});
  const [expandedHeltes, setExpandedHeltes] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedAlba, setExpandedAlba] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchJobPositions();
    fetchClausePositions();
  }, [clause.id]);

  const fetchJobPositions = async () => {
    try {
      const positions = await getAllJobPositions();
      setJobPositions(positions as JobPositionStructure[]);
      setJobPositions(positions as JobPositionStructure[]);
      console.log("Job positions fetched:", { count: positions.length });
    } catch (error) {
      console.error("Failed to fetch job positions:", error);
    }
  };

  const fetchClausePositions = async () => {
    try {
      const positions = await getClausePositionsByClauseId(clause.id);
      const positionMap = positions.reduce(
        (acc, pos) => {
          acc[pos.job_positionId] = pos.type;
          return acc;
        },
        {} as Record<string, type_clause_job_position>
      );
      setExistingPositions(positionMap);
      setSelectedPositions(positionMap);
      console.log("Clause positions fetched:", {
        clauseId: clause.id,
        count: positions.length,
      });
    } catch (error) {
      console.error("Failed to fetch clause positions:", error);
    }
  };

  const handlePositionToggle = async (positionId: string, checked: boolean) => {
    try {
      if (checked) {
        const type: type_clause_job_position = "IMPLEMENTATION";
        setSelectedPositions((prev) => ({ ...prev, [positionId]: type }));
        await createClausePositionsWithType(clause.id, [positionId], type);
      } else {
        const position = (await getClausePositionsByClauseId(clause.id)).find(
          (p) => p.job_positionId === positionId
        );
        if (position) {
          await deleteClausePosition(position.id);
        }
        setSelectedPositions((prev) => {
          const newState = { ...prev };
          delete newState[positionId];
          return newState;
        });
      }
      onSave();
      console.log("Position toggled:", { positionId, checked });
    } catch (error) {
      console.error("Failed to toggle position:", error);
    }
  };

  const handleActionTypeChange = async (
    positionId: string,
    actionType: type_clause_job_position
  ) => {
    try {
      const position = (await getClausePositionsByClauseId(clause.id)).find(
        (p) => p.job_positionId === positionId
      );
      if (position) {
        await deleteClausePosition(position.id);
        await createClausePositionsWithType(
          clause.id,
          [positionId],
          actionType
        );
      }
      setSelectedPositions((prev) => ({ ...prev, [positionId]: actionType }));
      onSave();
      console.log("Action type changed:", { positionId, actionType });
    } catch (error) {
      console.error("Failed to change action type:", error);
    }
  };

  const toggleOrganization = (orgId: string) => {
    setExpandedOrganizations((prev) => ({ ...prev, [orgId]: !prev[orgId] }));
  };

  const toggleHeltes = (orgId: string, heltesId: string) => {
    const key = `${orgId}-${heltesId}`;
    setExpandedHeltes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAlba = (orgId: string, heltesId: string, albaId: string) => {
    const key = `${orgId}-${heltesId}-${albaId}`;
    setExpandedAlba((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDrawerOpen(true)}
          className="bg-black text-white"
        >
          <Building className="h-4 w-4 mr-2" />
          Ажлын байр холбох
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Ажлын байр холбох</SheetTitle>
          <p className="text-sm text-muted-foreground">
            {clause.referenceNumber}. {clause.text}
          </p>
        </SheetHeader>

        <div className="flex justify-between items-center mt-4 mb-2">
          <div className="text-sm text-muted-foreground">
            {Object.keys(selectedPositions).length} ажлын байр сонгогдлоо
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const allOrgs = jobPositions.map((org) => org.organization.id);
                const allHeltes = jobPositions.flatMap((org) =>
                  org.structure
                    .filter((s) => s.heltes)
                    .map((s) => `${org.organization.id}-${s.heltes!.id}`)
                );
                const allAlba = jobPositions.flatMap((org) =>
                  org.structure.flatMap((s) =>
                    s.alba
                      .filter((a) => a.alba)
                      .map(
                        (a) =>
                          `${org.organization.id}-${s.heltes?.id || "null"}-${
                            a.alba!.id
                          }`
                      )
                  )
                );

                setExpandedOrganizations(
                  Object.fromEntries(allOrgs.map((id) => [id, true]))
                );
                setExpandedHeltes(
                  Object.fromEntries(allHeltes.map((id) => [id, true]))
                );
                setExpandedAlba(
                  Object.fromEntries(allAlba.map((id) => [id, true]))
                );
              }}
            >
              Бүгдийг нээх
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setExpandedOrganizations({});
                setExpandedHeltes({});
                setExpandedAlba({});
              }}
            >
              Бүгдийг хаах
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          {jobPositions.map((org) => {
            const isOrgExpanded = expandedOrganizations[org.organization.id];
            const totalPositions = org.structure.reduce(
              (acc, s) =>
                acc + s.alba.reduce((sum, a) => sum + a.positions.length, 0),
              0
            );

            return (
              <Collapsible
                key={org.organization.id}
                open={isOrgExpanded}
                onOpenChange={() => toggleOrganization(org.organization.id)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    {isOrgExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <Building className="h-4 w-4" />
                    <h3 className="font-semibold text-lg">
                      {org.organization.name}
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {totalPositions} ажлын байр
                  </Badge>
                </CollapsibleTrigger>

                <CollapsibleContent className="ml-6 mt-2 space-y-3">
                  {org.structure.map((struct, idx) => {
                    const heltesId = struct.heltes?.id || `null-${idx}`;
                    const heltesKey = `${org.organization.id}-${heltesId}`;
                    const isHeltesExpanded = expandedHeltes[heltesKey];
                    const totalHeltesPositions = struct.alba.reduce(
                      (acc, a) => acc + a.positions.length,
                      0
                    );

                    return (
                      <Collapsible
                        key={heltesId}
                        open={isHeltesExpanded}
                        onOpenChange={() =>
                          toggleHeltes(org.organization.id, heltesId)
                        }
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2">
                            {isHeltesExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                            <Badge variant="secondary" className="text-sm">
                              {struct.heltes?.name || "Хэлтэсгүй"}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {totalHeltesPositions} ажлын байр
                          </span>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="ml-2 mt-4 space-y-2">
                          {struct.alba.map((albaGroup) => {
                            const albaId =
                              albaGroup.alba?.id ||
                              `null-${albaGroup.positions[0]?.id || idx}`;
                            const albaKey = `${org.organization.id}-${heltesId}-${albaId}`;
                            const isAlbaExpanded = expandedAlba[albaKey];

                            return (
                              <Collapsible
                                key={albaId}
                                open={isAlbaExpanded}
                                onOpenChange={() =>
                                  toggleAlba(
                                    org.organization.id,
                                    heltesId,
                                    albaId
                                  )
                                }
                              >
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted">
                                  <div className="flex items-center gap-2">
                                    {isAlbaExpanded ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                    <h5 className="font-medium text-sm text-muted-foreground">
                                      {albaGroup.alba?.name || "Албагүй"}
                                    </h5>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {albaGroup.positions.length} ажлын байр
                                  </span>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="ml-4 mt-2 space-y-2">
                                  {albaGroup.positions.map((position) => (
                                    <div
                                      key={position.id}
                                      className="flex items-center gap-3 p-2 border rounded-lg hover:bg-muted/20 transition-colors"
                                    >
                                      <Checkbox
                                        id={position.id}
                                        checked={
                                          position.id in selectedPositions
                                        }
                                        onCheckedChange={(checked) =>
                                          handlePositionToggle(
                                            position.id,
                                            checked as boolean
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor={position.id}
                                        className="flex-1 text-sm font-medium cursor-pointer"
                                      >
                                        {position.name || "Нэргүй"}
                                      </label>
                                      {position.id in selectedPositions && (
                                        <Select
                                          value={selectedPositions[position.id]}
                                          onValueChange={(value) =>
                                            handleActionTypeChange(
                                              position.id,
                                              value as type_clause_job_position
                                            )
                                          }
                                        >
                                          <SelectTrigger className="w-36">
                                            <SelectValue placeholder="Төрөл сонго" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {actionTypes.map((type) => (
                                              <SelectItem
                                                key={type.value}
                                                value={type.value}
                                              >
                                                {type.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      )}
                                    </div>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            );
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Цуцлах
            </Button>
            <Button onClick={() => setIsDrawerOpen(false)}>Хадгалах</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
