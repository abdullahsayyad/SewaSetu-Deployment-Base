"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Complaint } from "@/lib/data/mock-db"
import { Clock, ExternalLink, Filter } from "lucide-react"
import { TrackingDialog } from "@/components/shared/tracking-dialog"
import { getComplaints } from "@/app/actions/complaints"

export default function ComplaintHistory() {
    const [complaints, setComplaints] = useState<Complaint[]>([])

    // State for the tracking modal
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)

    const [citizenId, setCitizenId] = useState<string | null>(null)

    useEffect(() => {
        const cId = localStorage.getItem("citizen_id")
        if (cId) {
            setCitizenId(cId)
            getComplaints(cId).then(setComplaints)
        } else {
            getComplaints().then(setComplaints) // Default fallback if no cookie
        }
    }, [])

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="bg-white border border-[#9CA3AF] overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#1e40af] tracking-tight">Grievance Ledger</h2>
                        <p className="text-sm text-slate-600 mt-0.5">Track the official status of your submitted petitions.</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 text-sm text-[#1e40af] hover:bg-slate-50 px-3 py-1.5 border border-[#9CA3AF] transition-none font-medium">
                            <Filter className="w-4 h-4" />
                            <span>Filter Status</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {complaints.filter(c => c.citizenId === citizenId).map((complaint) => (
                    <div key={complaint.id} className="bg-white border border-[#9CA3AF] p-5 hover:bg-slate-50 transition-none">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 border border-[#9CA3AF]">
                                        ID: {complaint.id}
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                        <span suppressHydrationWarning>
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </span>
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-[#1e40af] mt-1">{complaint.aiAnalysis.category_analysis.category}</h3>
                                <p className="text-slate-600 font-medium text-sm mt-1">{complaint.aiAnalysis.category_analysis.subcategory}</p>
                            </div>

                            <div className="flex flex-col items-end space-y-2">
                                <Badge variant={
                                    complaint.status === "Open" ? "outline" :
                                        complaint.status === "In Progress" ? "secondary" : "low"
                                } className={complaint.status === "Open" ? "bg-slate-100" : ""}>
                                    {complaint.status}
                                </Badge>

                                <div className="text-xs text-slate-500 font-medium">
                                    <Badge variant={
                                        complaint.aiAnalysis.severity_analysis.severity_level === "Critical" ? "critical" :
                                            complaint.aiAnalysis.severity_analysis.severity_level === "High" ? "high" :
                                                complaint.aiAnalysis.severity_analysis.severity_level === "Medium" ? "moderate" : "low"
                                    }>
                                        {complaint.aiAnalysis.severity_analysis.severity_level}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#9CA3AF] p-4 mb-4">
                            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2 block">Issue Description</span>
                            <p className="text-sm text-slate-800 italic">"{complaint.description}"</p>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                            <span className="text-xs text-slate-500 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                <span suppressHydrationWarning>
                                    Last Updated: {new Date().toLocaleDateString()}
                                </span>
                            </span>
                            <button
                                onClick={() => setSelectedComplaint(complaint)}
                                className="text-sm text-[#0B3D91] hover:text-[#0B3D91]/80 font-semibold flex items-center transition-colors"
                            >
                                View Official Tracking <ExternalLink className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <TrackingDialog
                complaint={selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
            />
        </div>
    )
}
