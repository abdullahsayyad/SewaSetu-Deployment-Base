"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Complaint } from "@/lib/data/mock-db"
import { getComplaints } from "@/app/actions/complaints"
import { Filter } from "lucide-react"

const CivicMap = dynamic(() => import("@/components/shared/civic-map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center">
            <div className="text-slate-500 font-medium">Initializing Locality Map...</div>
        </div>
    )
})

export default function DepartmentMap() {
    // In a real app we would get the logged-in department
    const [department, setDepartment] = useState("Electricity")
    const [allComplaints, setAllComplaints] = useState<Complaint[]>([])

    useEffect(() => {
        const storedDept = localStorage.getItem("auth_department") || "Electricity"
        setDepartment(storedDept)
        getComplaints().then(setAllComplaints)
    }, [])

    // Filter complaints specifically for the logged in department
    const complaints = allComplaints.filter(c => c.departmentName === department && c.status !== "Resolved")

    return (
        <div className="space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 shadow-sm rounded-lg shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-[#0B3D91] tracking-tight">{department} Department Map</h2>
                    <p className="text-slate-600 mt-1">Showing {complaints.length} active grievances requiring field teams.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 text-sm text-slate-600 hover:text-[#0B3D91] bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-md border border-slate-300 transition-colors font-medium">
                        <Filter className="w-4 h-4" />
                        <span>Filter Risk</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-[500px] relative rounded-md border border-slate-200 overflow-hidden shadow-sm bg-white">
                <div className="absolute top-4 right-4 z-[400] bg-white border border-slate-200 p-4 rounded-md shadow-md">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Escalation Legend</h4>
                    <div className="space-y-2.5 text-sm font-medium text-slate-700">
                        <div className="flex items-center"><span className="w-3.5 h-3.5 rounded-full bg-[#DC2626] border-2 border-white shadow-sm mr-2.5"></span> Critical (&gt;75)</div>
                        <div className="flex items-center"><span className="w-3.5 h-3.5 rounded-full bg-[#EA580C] border-2 border-white shadow-sm mr-2.5"></span> High (51-75)</div>
                        <div className="flex items-center"><span className="w-3.5 h-3.5 rounded-full bg-[#CA8A04] border-2 border-white shadow-sm mr-2.5"></span> Medium (26-50)</div>
                        <div className="flex items-center"><span className="w-3.5 h-3.5 rounded-full bg-[#16A34A] border-2 border-white shadow-sm mr-2.5"></span> Low (0-25)</div>
                    </div>
                </div>
                <CivicMap complaints={complaints} height="100%" />
            </div>
        </div>
    )
}
