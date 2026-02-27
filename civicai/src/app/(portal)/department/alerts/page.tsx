"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Complaint } from "@/lib/data/mock-db"
import { getComplaints } from "@/app/actions/complaints"
import { AlertOctagon, Clock, UserCheck } from "lucide-react"

export default function HighRiskAlerts() {
    const [department, setDepartment] = useState("Electricity")
    const [allComplaints, setAllComplaints] = useState<Complaint[]>([])

    useEffect(() => {
        const storedDept = localStorage.getItem("auth_department") || "Electricity"
        setDepartment(storedDept)
        getComplaints().then(setAllComplaints)
    }, [])

    // Show only critically elevated complaints for this dept
    const complaints = allComplaints.filter(c => c.departmentName === department && c.status !== "Resolved" && c.aiAnalysis.severity_analysis.severity_level === "Critical")

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#DC2626] tracking-tight flex items-center">
                        <AlertOctagon className="w-8 h-8 mr-3" />
                        High Risk Alerts
                    </h2>
                    <p className="text-slate-600 mt-1 font-medium">Escalation Score &gt; 75. Immediate emergency response prescribed by Standard Operating Procedure.</p>
                </div>
            </div>

            <div className="space-y-6">
                {complaints.map(complaint => (
                    <Card key={complaint.id} className="border-[#DC2626] border-2 bg-white relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 left-0 w-2 h-full bg-[#DC2626]"></div>

                        <CardContent className="p-8 pl-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-red-100 pb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#0B3D91] mb-3">{complaint.aiAnalysis.category_analysis.subcategory}</h3>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-200">
                                            ID: {complaint.id}
                                        </span>
                                        <Badge variant="critical">
                                            Escalation Critical: {complaint.aiAnalysis.priority_scoring.priority_score}/100
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 flex items-center bg-red-50 rounded-lg p-4 border border-red-200">
                                    <Clock className="w-6 h-6 text-[#DC2626] mr-3" />
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase font-bold text-[#DC2626] tracking-wider">SLA Threshold</span>
                                        <span className="text-lg font-mono font-bold text-red-900">Pending 12h 45m</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-100">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Original Grievance Summary</h4>
                                    <p className="text-slate-700 italic border-l-4 border-slate-300 pl-3">"{complaint.description}"</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prescribed Action Protocol</h4>
                                    <div className="bg-red-50 border border-red-200 p-3 text-red-900 font-medium rounded">
                                        {complaint.aiAnalysis.suggestedAction}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-2">
                                <Button variant="outline" className="border-slate-300 font-semibold text-slate-700 hover:bg-slate-50">
                                    Acknowledge & Escalate
                                </Button>
                                <Button className="bg-[#DC2626] hover:bg-[#DC2626]/90 text-white font-bold px-8 shadow-sm">
                                    <UserCheck className="w-5 h-5 mr-2" /> Dispatch Emergency Team
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                ))}

                {complaints.length === 0 && (
                    <div className="text-center p-16 text-slate-500 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <AlertOctagon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">No Critical Alerts</h3>
                        <p className="mt-2 text-sm">All operations currently nominal and within SLA thresholds.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
