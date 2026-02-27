"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Complaint } from "@/lib/data/mock-db"
import { getComplaints, resolveComplaint } from "@/app/actions/complaints"
import { FullReportDialog } from "@/components/shared/full-report-dialog"
import { FileText, MapPin, BrainCircuit, CheckSquare } from "lucide-react"

export default function IncomingComplaints() {
    const [department, setDepartment] = useState("Electricity")
    const [allComplaints, setAllComplaints] = useState<Complaint[]>([])
    const [selectedReport, setSelectedReport] = useState<Complaint | null>(null)
    const [isResolving, setIsResolving] = useState<string | null>(null)

    const fetchComplaints = () => {
        getComplaints().then(setAllComplaints)
    }

    useEffect(() => {
        const storedDept = localStorage.getItem("auth_department") || "Electricity"
        setDepartment(storedDept)
        fetchComplaints()
    }, [])

    const handleResolve = async (id: string) => {
        setIsResolving(id)
        const res = await resolveComplaint(id)
        if (res.success) {
            fetchComplaints()
        }
        setIsResolving(null)
    }

    // Show complaints specifically routed to this department
    const complaints = allComplaints.filter(c => c.departmentName === department && c.status !== "Resolved")

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-end mb-8 border-b border-[#9CA3AF] pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#0B3D91] tracking-tight">Intelligence Queue</h2>
                    <p className="text-slate-700 mt-1">AI-processed grievances awaiting departmental action.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {complaints.map(complaint => {
                    const level = complaint.aiAnalysis.severity_analysis.severity_level;
                    const isCritical = level === "Critical";
                    const isHigh = level === "High";
                    const isModerate = level === "Medium";

                    const headerBg = isCritical ? "bg-[#cc0000]" : isHigh ? "bg-[#ea580c]" : isModerate ? "bg-[#eab308]" : "bg-[#16a34a]";
                    const bodyBg = isCritical ? "bg-[#fff1f0]" : isHigh ? "bg-[#fff7ed]" : isModerate ? "bg-[#fefce8]" : "bg-[#f0fdf4]";
                    const borderColor = isCritical ? "border-red-200" : isHigh ? "border-orange-200" : isModerate ? "border-yellow-200" : "border-green-200";
                    const textColor = isCritical ? "text-red-950" : isHigh ? "text-orange-950" : isModerate ? "text-yellow-950" : "text-green-950";
                    const mutedColor = isCritical ? "text-red-800" : isHigh ? "text-orange-800" : isModerate ? "text-yellow-800" : "text-green-800";

                    return (
                        <div key={complaint.id} className={`border ${borderColor} overflow-hidden shadow-none flex flex-col`}>
                            <div className={`${headerBg} px-4 py-2 flex justify-between items-center text-white`}>
                                <div className="flex items-center space-x-1.5">
                                    <span className="text-sm font-semibold tracking-wide">{level} Alert</span>
                                </div>
                                <span className="text-xs font-medium bg-black/20 px-2 py-0.5 rounded-sm" suppressHydrationWarning>
                                    {new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div className={`${bodyBg} p-5 flex-1 flex flex-col`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-xs font-mono font-bold px-2 py-1 bg-white/60 border ${borderColor} ${textColor}`}>
                                            ID: {complaint.id}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold ${mutedColor}`}>
                                        Escalation: {complaint.aiAnalysis.priority_scoring.priority_score}/100
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <h4 className={`text-xl font-bold ${textColor} mb-1.5`}>{complaint.aiAnalysis.category_analysis.subcategory}</h4>
                                    <div className={`flex items-center text-sm font-medium ${mutedColor}`}>
                                        <MapPin className="w-4 h-4 mr-1 opacity-70" />
                                        {complaint.location.address}
                                    </div>
                                </div>

                                <div className={`bg-white/60 border ${borderColor} p-4 mb-5`}>
                                    <div className="flex items-center mb-2">
                                        <BrainCircuit className={`w-4 h-4 mr-2 ${textColor}`} />
                                        <span className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>AI Extraction Summary</span>
                                    </div>
                                    <p className={`text-sm italic ${textColor}`}>"{complaint.aiAnalysis.summary}"</p>
                                    <div className={`mt-3 flex items-center justify-between border-t ${borderColor} pt-3`}>
                                        <div className={`text-sm ${mutedColor}`}>
                                            <span className={`font-bold ${textColor} mr-2`}>Suggested Action:</span>
                                            {complaint.aiAnalysis.suggestedAction}
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex space-x-3 border-t ${borderColor} pt-4 mt-auto`}>
                                    <Button variant="outline" onClick={() => setSelectedReport(complaint)} className="flex-1 bg-white border-slate-400 text-slate-800 font-semibold shadow-none hover:bg-slate-50">
                                        <FileText className="w-4 h-4 mr-2" /> View Full Report
                                    </Button>
                                    <Button
                                        onClick={() => handleResolve(complaint.id)}
                                        disabled={isResolving === complaint.id}
                                        className="bg-[#138808] hover:bg-[#138808]/90 text-white font-semibold flex-1 shadow-none"
                                    >
                                        {isResolving === complaint.id ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin mr-2"></div>
                                        ) : (
                                            <CheckSquare className="w-4 h-4 mr-2" />
                                        )}
                                        {isResolving === complaint.id ? "Resolving..." : "Resolve Incident"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {
                complaints.length === 0 && (
                    <div className="text-center p-16 text-slate-600 border border-dashed border-[#9CA3AF] bg-slate-50">
                        <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">Queue Operational</h3>
                        <p className="mt-2 text-sm">All current grievances have been processed and distributed.</p>
                    </div>
                )
            }

            <FullReportDialog
                complaint={selectedReport}
                onClose={() => setSelectedReport(null)}
            />
        </div >
    )
}
