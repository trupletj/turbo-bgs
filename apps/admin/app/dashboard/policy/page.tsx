import React from 'react'
import { DataTable } from '@/components/data-table'
import data from "./data.json"

const PolicyPage = () => {
    return (

        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={data} />
        </div>
    )
}

export default PolicyPage