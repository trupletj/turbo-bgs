import ClauseJobConnect from '@/components/clause-jobe-connect'
import React from 'react'

const page =async ({
  params,
}: {
  params: Promise<{ clause_id: string }>
}) => {
     const { clause_id } = await params
  return (
  <ClauseJobConnect  />
  )
}

export default page