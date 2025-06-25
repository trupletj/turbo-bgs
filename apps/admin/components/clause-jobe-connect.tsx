
import React from 'react'
import { Prisma } from '@repo/database/generated/prisma/client/client'

import {getOrganizations} from "@/action/OrganizationService"
import { ChevronRight, Building2, Users, Briefcase, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import OrganizationNode from './organization-node'
import { OrganizationWithJobRelations } from '@/types/organization'

const ClauseJobConnect = async () => {
    const organizations  = await getOrganizations({
    orderBy: { name: 'asc' },
    include: {
      // ↘︎ шууд харьяа positions
      job_position: {
        where: {
          alba_id: null,
          heltes_id: null,
          is_active : true
        },
      },

      // ↘︎ departments (alba)
      heltes: {
        orderBy: { name: 'asc' },
        include: {
          // dept-ийн дотор direct positions
          job_position: {
            where: { alba_id: null , is_active : true },
          },

          // divisions (heltes)
          alba: {
            include: {
              job_position: {
                where : {
                    is_active : true
                }
              } // division-ийн positions
            },
          },
        },
      },
        alba: {
            include: {
              job_position: {
                where : {
                    is_active : true,
                    heltes_id : null
                }
              } // division-ийн positions
            },
          },
      
    },
    where : {
        bteg_id : {
            in : ['1','2', '20']
        }
    }
  })as OrganizationWithJobRelations[]; 

  return (
    <div>
     <div className="space-y-4">
            {organizations && organizations.map((org ) => (
              <OrganizationNode key={org.id} organization={org } />
            ))}
          </div>
    </div>
  )
}



export default ClauseJobConnect