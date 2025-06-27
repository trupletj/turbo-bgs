import { Prisma } from "@repo/database/generated/prisma/client/client";

export type OrganizationWithJobRelations = Prisma.organizationGetPayload<{
  include: {
    job_position: true;
    heltes: {
      include: {
        job_position: true;
        alba: {
          include: {
            job_position: true;
          };
        };
      };
    };
    alba: {
      include: {
        job_position: true;
      };
    };
  };
}>;

export type HeltesWithJobRelations = Prisma.heltesGetPayload<{
  include: {
    job_position: true;
    alba: {
      include: {
        job_position: true;
      };
    };
  };
}>;

export type AlbaWithJobRelations = Prisma.heltesGetPayload<{
  include: {
    job_position: true;
  };
}>;

export type JobPositionWithOrganization = Prisma.clause_job_positionGetPayload<{
  include: {
    job_position: {
      include: {
        organization: true;
      };
    };
  };
}>;
