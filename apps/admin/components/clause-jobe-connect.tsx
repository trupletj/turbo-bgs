"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Link, Users, Building, ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface JobPosition {
  id: string;
  name: string;
  department: string;
  division: string;
  organization: string;
}

interface PolicyClause {
  id: string;
  title: string;
  description: string;
}

interface PolicySection {
  id: string;
  name: string;
  clauses: PolicyClause[];
}

const mockJobPositions: JobPosition[] = [
  {
    id: "1",
    name: "Software Engineer",
    department: "Engineering",
    division: "Technology",
    organization: "Tech Corp",
  },
  {
    id: "2",
    name: "Product Manager",
    department: "Product",
    division: "Technology",
    organization: "Tech Corp",
  },
  {
    id: "3",
    name: "QA Engineer",
    department: "Engineering",
    division: "Technology",
    organization: "Tech Corp",
  },
  {
    id: "4",
    name: "HR Manager",
    department: "Human Resources",
    division: "Operations",
    organization: "Tech Corp",
  },
  {
    id: "5",
    name: "Finance Analyst",
    department: "Finance",
    division: "Operations",
    organization: "Tech Corp",
  },
  {
    id: "6",
    name: "Marketing Specialist",
    department: "Marketing",
    division: "Business",
    organization: "Tech Corp",
  },
  {
    id: "7",
    name: "Sales Representative",
    department: "Sales",
    division: "Business",
    organization: "Tech Corp",
  },
  {
    id: "8",
    name: "DevOps Engineer",
    department: "Engineering",
    division: "Technology",
    organization: "Tech Corp",
  },
];

const mockPolicySections: PolicySection[] = [
  {
    id: "1",
    name: "Data Protection",
    clauses: [
      {
        id: "1-1",
        title: "Personal Data Collection",
        description:
          "Guidelines for collecting personal information from users and employees.",
      },
      {
        id: "1-2",
        title: "Data Storage Security",
        description:
          "Requirements for secure storage and encryption of sensitive data.",
      },
      {
        id: "1-3",
        title: "Data Access Controls",
        description:
          "Procedures for controlling access to confidential information.",
      },
    ],
  },
  {
    id: "2",
    name: "Information Security",
    clauses: [
      {
        id: "2-1",
        title: "Password Policy",
        description: "Standards for creating and maintaining secure passwords.",
      },
      {
        id: "2-2",
        title: "Network Security",
        description:
          "Protocols for maintaining secure network connections and VPN usage.",
      },
      {
        id: "2-3",
        title: "Incident Response",
        description:
          "Procedures for responding to security breaches and incidents.",
      },
    ],
  },
  {
    id: "3",
    name: "Compliance",
    clauses: [
      {
        id: "3-1",
        title: "Regulatory Compliance",
        description:
          "Adherence to industry regulations and legal requirements.",
      },
      {
        id: "3-2",
        title: "Audit Procedures",
        description: "Internal and external audit processes and requirements.",
      },
      {
        id: "3-3",
        title: "Documentation Standards",
        description: "Standards for maintaining compliance documentation.",
      },
    ],
  },
];

const actionTypes = ["батлах", "хангах", "хянах"];

export default function ClauseJobConnect() {
  const [selectedPositions, setSelectedPositions] = useState<
    Record<string, string>
  >({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedClause, setSelectedClause] = useState<PolicyClause | null>(
    null
  );
  const [expandedOrganizations, setExpandedOrganizations] = useState<
    Record<string, boolean>
  >({});
  const [expandedDivisions, setExpandedDivisions] = useState<
    Record<string, boolean>
  >({});
  const [expandedDepartments, setExpandedDepartments] = useState<
    Record<string, boolean>
  >({});

  const handlePositionToggle = (positionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPositions((prev) => ({ ...prev, [positionId]: "" }));
    } else {
      setSelectedPositions((prev) => {
        const newState = { ...prev };
        delete newState[positionId];
        return newState;
      });
    }
  };

  const handleActionTypeChange = (positionId: string, actionType: string) => {
    setSelectedPositions((prev) => ({ ...prev, [positionId]: actionType }));
  };

  const handleConnectClick = (clause: PolicyClause) => {
    setSelectedClause(clause);
    setIsDrawerOpen(true);
  };

  const toggleOrganization = (org: string) => {
    setExpandedOrganizations((prev) => ({ ...prev, [org]: !prev[org] }));
  };

  const toggleDivision = (org: string, div: string) => {
    const key = `${org}-${div}`;
    setExpandedDivisions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDepartment = (org: string, div: string, dept: string) => {
    const key = `${org}-${div}-${dept}`;
    setExpandedDepartments((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const groupedPositions = mockJobPositions.reduce(
    (acc, position) => {
      const orgKey = position.organization;
      const divKey = position.division;
      const deptKey = position.department;

      if (!acc[orgKey]) acc[orgKey] = {};
      if (!acc[orgKey][divKey]) acc[orgKey][divKey] = {};
      if (!acc[orgKey][divKey][deptKey]) acc[orgKey][divKey][deptKey] = [];

      acc[orgKey][divKey][deptKey].push(position);
      return acc;
    },
    {} as Record<string, Record<string, Record<string, JobPosition[]>>>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Information Security Policy</h1>
        <p className="text-muted-foreground">
          Comprehensive policy framework for data protection, security, and
          compliance requirements.
        </p>
      </div>

      <div className="space-y-6">
        {mockPolicySections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {section.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.clauses.map((clause) => (
                  <div key={clause.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{clause.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {clause.description}
                        </p>
                      </div>
                      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConnectClick(clause)}
                            className="bg-black text-white"
                          >
                            <Link className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[600px] sm:max-w-[600px]">
                          <SheetHeader>
                            <SheetTitle>Connect Job Positions</SheetTitle>
                            <p className="text-sm text-muted-foreground">
                              {selectedClause?.title}
                            </p>
                          </SheetHeader>

                          <div className="flex justify-between items-center mt-4 mb-2">
                            <div className="text-sm text-muted-foreground">
                              {Object.keys(selectedPositions).length} positions
                              selected
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const allOrgs = Object.keys(groupedPositions);
                                  const allDivs = allOrgs.flatMap((org) =>
                                    Object.keys(groupedPositions[org]).map(
                                      (div) => `${org}-${div}`
                                    )
                                  );
                                  const allDepts = allOrgs.flatMap((org) =>
                                    Object.entries(
                                      groupedPositions[org]
                                    ).flatMap(([div, depts]) =>
                                      Object.keys(depts).map(
                                        (dept) => `${org}-${div}-${dept}`
                                      )
                                    )
                                  );

                                  setExpandedOrganizations(
                                    Object.fromEntries(
                                      allOrgs.map((org) => [org, true])
                                    )
                                  );
                                  setExpandedDivisions(
                                    Object.fromEntries(
                                      allDivs.map((div) => [div, true])
                                    )
                                  );
                                  setExpandedDepartments(
                                    Object.fromEntries(
                                      allDepts.map((dept) => [dept, true])
                                    )
                                  );
                                }}
                              >
                                Expand All
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setExpandedOrganizations({});
                                  setExpandedDivisions({});
                                  setExpandedDepartments({});
                                }}
                              >
                                Collapse All
                              </Button>
                            </div>
                          </div>

                          <div className="mt-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                            {Object.entries(groupedPositions).map(
                              ([organization, divisions]) => {
                                const isOrgExpanded =
                                  expandedOrganizations[organization];
                                const totalPositions = Object.values(
                                  divisions
                                ).reduce(
                                  (acc, depts) =>
                                    acc +
                                    Object.values(depts).reduce(
                                      (deptAcc, positions) =>
                                        deptAcc + positions.length,
                                      0
                                    ),
                                  0
                                );

                                return (
                                  <Collapsible
                                    key={organization}
                                    open={isOrgExpanded}
                                    onOpenChange={() =>
                                      toggleOrganization(organization)
                                    }
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
                                          {organization}
                                        </h3>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {totalPositions} positions
                                      </Badge>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="ml-6 mt-2 space-y-3">
                                      {Object.entries(divisions).map(
                                        ([division, departments]) => {
                                          const divKey = `${organization}-${division}`;
                                          const isDivExpanded =
                                            expandedDivisions[divKey];
                                          const divPositions = Object.values(
                                            departments
                                          ).reduce(
                                            (acc, positions) =>
                                              acc + positions.length,
                                            0
                                          );

                                          return (
                                            <Collapsible
                                              key={division}
                                              open={isDivExpanded}
                                              onOpenChange={() =>
                                                toggleDivision(
                                                  organization,
                                                  division
                                                )
                                              }
                                            >
                                              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-md transition-colors">
                                                <div className="flex items-center gap-2">
                                                  {isDivExpanded ? (
                                                    <ChevronDown className="h-3 w-3" />
                                                  ) : (
                                                    <ChevronRight className="h-3 w-3" />
                                                  )}
                                                  <Badge
                                                    variant="secondary"
                                                    className="text-sm"
                                                  >
                                                    {division}
                                                  </Badge>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                  {divPositions} positions
                                                </span>
                                              </CollapsibleTrigger>

                                              <CollapsibleContent className="ml-4 mt-2 space-y-2">
                                                {Object.entries(
                                                  departments
                                                ).map(
                                                  ([department, positions]) => {
                                                    const deptKey = `${organization}-${division}-${department}`;
                                                    const isDeptExpanded =
                                                      expandedDepartments[
                                                        deptKey
                                                      ];

                                                    return (
                                                      <Collapsible
                                                        key={department}
                                                        open={isDeptExpanded}
                                                        onOpenChange={() =>
                                                          toggleDepartment(
                                                            organization,
                                                            division,
                                                            department
                                                          )
                                                        }
                                                      >
                                                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/30 rounded-md transition-colors">
                                                          <div className="flex items-center gap-2">
                                                            {isDeptExpanded ? (
                                                              <ChevronDown className="h-3 w-3" />
                                                            ) : (
                                                              <ChevronRight className="h-3 w-3" />
                                                            )}
                                                            <h5 className="font-medium text-sm text-muted-foreground">
                                                              {department}
                                                            </h5>
                                                          </div>
                                                          <span className="text-xs text-muted-foreground">
                                                            {positions.length}{" "}
                                                            positions
                                                          </span>
                                                        </CollapsibleTrigger>

                                                        <CollapsibleContent className="ml-4 mt-2 space-y-2">
                                                          {positions.map(
                                                            (position) => (
                                                              <div
                                                                key={
                                                                  position.id
                                                                }
                                                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                                                              >
                                                                <Checkbox
                                                                  id={
                                                                    position.id
                                                                  }
                                                                  checked={
                                                                    position.id in
                                                                    selectedPositions
                                                                  }
                                                                  onCheckedChange={(
                                                                    checked
                                                                  ) =>
                                                                    handlePositionToggle(
                                                                      position.id,
                                                                      checked as boolean
                                                                    )
                                                                  }
                                                                />
                                                                <label
                                                                  htmlFor={
                                                                    position.id
                                                                  }
                                                                  className="flex-1 text-sm font-medium cursor-pointer"
                                                                >
                                                                  {
                                                                    position.name
                                                                  }
                                                                </label>

                                                                {position.id in
                                                                  selectedPositions && (
                                                                  <Select
                                                                    value={
                                                                      selectedPositions[
                                                                        position
                                                                          .id
                                                                      ]
                                                                    }
                                                                    onValueChange={(
                                                                      value
                                                                    ) =>
                                                                      handleActionTypeChange(
                                                                        position.id,
                                                                        value
                                                                      )
                                                                    }
                                                                  >
                                                                    <SelectTrigger className="w-32">
                                                                      <SelectValue placeholder="Select type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                      {actionTypes.map(
                                                                        (
                                                                          type
                                                                        ) => (
                                                                          <SelectItem
                                                                            key={
                                                                              type
                                                                            }
                                                                            value={
                                                                              type
                                                                            }
                                                                          >
                                                                            {
                                                                              type
                                                                            }
                                                                          </SelectItem>
                                                                        )
                                                                      )}
                                                                    </SelectContent>
                                                                  </Select>
                                                                )}
                                                              </div>
                                                            )
                                                          )}
                                                        </CollapsibleContent>
                                                      </Collapsible>
                                                    );
                                                  }
                                                )}
                                              </CollapsibleContent>
                                            </Collapsible>
                                          );
                                        }
                                      )}
                                    </CollapsibleContent>
                                  </Collapsible>
                                );
                              }
                            )}
                          </div>

                          <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between">
                              <Button
                                variant="outline"
                                onClick={() => setIsDrawerOpen(false)}
                                className="bg-black text-white"
                              >
                                Cancel
                              </Button>
                              <Button onClick={() => setIsDrawerOpen(false)}>
                                Save Connections
                              </Button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
