"use server";

import { prisma } from "@repo/database";

export const getJobPosition = async (id: string) => {
  try {
    const job_position = await prisma.job_position.findUnique({
      where: { id, is_active: true },
    });
    if (!job_position) throw new Error("Ажлын байр олдсонгүй");
    return job_position;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(error.message || "Алдаа гарлаа");
    } else {
      console.error("Тодорхой бус алдаа:", error);
      throw new Error("Алдаа гарлаа");
    }
  }
};

export const getAllJobPositions = async () => {
  try {
    const jobPositions = await prisma.job_position.findMany({
      where: {
        is_active: true,
        organization_id: { not: null },
      },
      select: {
        id: true,
        bteg_id: true,
        name: true,
        description: true,
        created_at: true,
        organization: {
          where: {
            is_active: true,
          },
          select: {
            id: true,
            bteg_id: true,
            name: true,
            sub_title: true,
            description: true,
          },
        },
        heltes: {
          where: {
            is_active: true,
          },
          select: {
            id: true,
            bteg_id: true,
            name: true,
            sub_title: true,
            description: true,
          },
        },
        alba: {
          where: {
            is_active: true,
          },
          select: {
            id: true,
            bteg_id: true,
            name: true,
            sub_title: true,
            description: true,
          },
        },
      },
    });

    const orgMap = new Map<
      string,
      {
        organization: (typeof jobPositions)[number]["organization"];
        structure: Array<{
          heltes: (typeof jobPositions)[number]["heltes"] | null;
          alba: (typeof jobPositions)[number]["alba"] | null;
          position: {
            id: string;
            bteg_id: string | null;
            name: string | null;
            description: string | null;
            created_at: Date;
          };
        }>;
      }
    >();

    for (const pos of jobPositions) {
      if (!pos.organization) continue;

      const orgId = pos.organization.id;
      if (!orgMap.has(orgId)) {
        orgMap.set(orgId, {
          organization: {
            id: pos.organization.id,
            bteg_id: pos.organization.bteg_id,
            name: pos.organization.name,
            sub_title: pos.organization.sub_title,
            description: pos.organization.description,
          },
          structure: [],
        });
      }

      const org = orgMap.get(orgId)!;
      org.structure.push({
        heltes: pos.heltes ? pos.heltes : null,
        alba: pos.alba ? pos.alba : null,
        position: {
          id: pos.id,
          bteg_id: pos.bteg_id,
          name: pos.name,
          description: pos.description,
          created_at: pos.created_at,
        },
      });
    }

    const structuredData = Array.from(orgMap.values()).map((org) => ({
      organization: org.organization,
      structure: org.structure.reduce<
        Array<{
          heltes: (typeof org.structure)[number]["heltes"];
          alba: Array<{
            alba: (typeof org.structure)[number]["alba"];
            positions: (typeof org.structure)[number]["position"][];
          }>;
        }>
      >((acc, curr) => {
        // If no heltes or alba, add position directly under organization
        if (!curr.heltes && !curr.alba) {
          acc.push({
            heltes: null,
            alba: [
              {
                alba: null,
                positions: [curr.position],
              },
            ],
          });
          return acc;
        }

        // Find or create heltes group
        let heltesGroup = curr.heltes
          ? acc.find((h) => h.heltes?.id === curr.heltes!.id)
          : null;

        if (!heltesGroup && curr.heltes) {
          heltesGroup = {
            heltes: curr.heltes,
            alba: [],
          };
          acc.push(heltesGroup);
        }

        // If heltes exists, group by alba or add position directly under heltes
        if (heltesGroup) {
          if (!curr.alba) {
            let albaGroup = heltesGroup.alba.find((a) => a.alba === null);
            if (!albaGroup) {
              albaGroup = { alba: null, positions: [] };
              heltesGroup.alba.push(albaGroup);
            }
            albaGroup.positions.push(curr.position);
          } else {
            let albaGroup = heltesGroup.alba.find(
              (a) => a.alba?.id === curr.alba!.id
            );
            if (!albaGroup) {
              albaGroup = { alba: curr.alba, positions: [] };
              heltesGroup.alba.push(albaGroup);
            }
            albaGroup.positions.push(curr.position);
          }
        } else {
          // No heltes, group by alba directly under organization
          let albaGroup = acc.find(
            (h) => h.heltes === null && h.alba[0]?.alba?.id === curr.alba?.id
          );
          if (!albaGroup) {
            albaGroup = {
              heltes: null,
              alba: [{ alba: curr.alba, positions: [] }],
            };
            acc.push(albaGroup);
          }
          albaGroup.alba[0].positions.push(curr.position);
        }

        return acc;
      }, []),
    }));

    return structuredData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(error.message || "Алдаа гарлаа");
    } else {
      console.error("Тодорхой бус алдаа:", error);
      throw new Error("Алдаа гарлаа");
    }
  }
};
