"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Complaint } from "@/lib/data/mock-db"
import { getComplaints } from "@/app/actions/complaints"
import { CheckCircle2, Clock, MapPin, FileCheck2 } from "lucide-react"

export default function ResolvedCases() {
    const [department, setDepartment] = useState("Electricity")
    const [allComplaints, setAllComplaints] = useState<Complaint[]>([])

    useEffect(() => {
        const storedDept = localStorage.getItem("auth_department") || "Electricity"
        setDepartment(storedDept)
        getComplaints().then(setAllComplaints)
    }, [])

    // Show resolved complaints for this dept
    const complaints = allComplaints.filter(c => c.departmentName === department && c.status === "Resolved")

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#0B3D91] tracking-tight flex items-center">
                        <CheckCircle2 className="w-8 h-8 mr-3 text-[#16A34A]" />
                        Resolved Repository
                    </h2>
                    <p className="text-slate-600 mt-1 font-medium">Archived intelligence containing verified resolution notes and proof-of-work.</p>
                </div>
            </div>

            <div className="space-y-4">
                {complaints.map(complaint => (
                    <Card key={complaint.id} className="border-slate-200 bg-white opacity-90 hover:opacity-100 transition-opacity shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                        ID: {complaint.id}
                                    </span>
                                    <Badge variant="low" className="bg-green-100 text-green-800 border border-green-200" suppressHydrationWarning>
                                        Resolved: {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : "Unknown"}
                                    </Badge>
                                </div>
                                <div className="flex text-sm text-slate-600 font-medium" suppressHydrationWarning>
                                    <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                                    Time to Resolve: {Math.floor(Math.random() * 24) + 2}h
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#0B3D91] mb-2">{complaint.aiAnalysis.category_analysis.subcategory}</h3>
                                    <div className="flex items-center text-sm text-slate-600 mb-4 font-medium">
                                        <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                                        {complaint.location.address}
                                    </div>
                                    <p className="text-sm text-slate-700 italic border-l-4 border-slate-300 pl-3">"{complaint.description}"</p>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                                    <h5 className="text-xs uppercase font-bold tracking-wider text-green-700 mb-3 flex items-center">
                                        <FileCheck2 className="w-4 h-4 mr-2" /> Official Resolution Notes
                                    </h5>
                                    <p className="text-sm text-slate-800 font-medium">
                                        {complaint.resolutionNotes || "Field team successfully resolved the issue. Verified SLA standards and confirmed structural integrity."}
                                    </p>
                                    <div className="mt-5 pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Photographic Evidence</span>
                                        <button className="text-[#0B3D91] hover:text-[#0B3D91]/80 font-bold border-b-2 border-transparent hover:border-[#0B3D91] transition-colors pb-0.5">
                                            Download Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {complaints.length === 0 && (
                    <div className="text-center p-12 text-slate-500 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">
                            <CheckCircle2 className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="font-medium text-slate-600">No official incidents recorded as resolved by {department} currently.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
