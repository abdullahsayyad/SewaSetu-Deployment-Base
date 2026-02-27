"use client"

import { Complaint } from "@/lib/data/mock-db"
import { CheckCircle2, Clock, X, FileText, Activity } from "lucide-react"

interface TrackingDialogProps {
    complaint: Complaint | null
    onClose: () => void
}

export function TrackingDialog({ complaint, onClose }: TrackingDialogProps) {
    if (!complaint) return null

    const steps = [
        { label: "Grievance Logged", date: new Date(complaint.createdAt).toLocaleDateString(), completed: true },
        { label: "AI Analysis & Routing", date: new Date(new Date(complaint.createdAt).getTime() + 1000 * 60 * 5).toLocaleDateString(), completed: true },
        { label: "Department Assigned", date: complaint.status !== "Open" ? new Date(new Date(complaint.createdAt).getTime() + 1000 * 60 * 60).toLocaleDateString() : "Pending", completed: complaint.status !== "Open" },
        { label: "Field Inspection", date: complaint.status === "Resolved" || complaint.status === "In Progress" ? "In Progress" : "Pending", completed: complaint.status === "Resolved" },
        { label: "Resolution Verified", date: complaint.status === "Resolved" ? new Date().toLocaleDateString() : "Pending", completed: complaint.status === "Resolved" }
    ]

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-[#0B3D91] text-white p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-[#ff9933]" />
                        <h2 className="text-lg font-bold tracking-wide">Official Grievance Tracking</h2>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Docket Summary */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 p-4 border border-slate-200 rounded-md mb-8">
                        <div>
                            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">Docket ID</span>
                            <span className="font-mono text-xl font-bold text-[#0B3D91]">{complaint.id}</span>
                        </div>
                        <div className="mt-3 md:mt-0 text-right">
                            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">Current Status</span>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200' :
                                complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                    'bg-slate-200 text-slate-700 border-slate-300'
                                }`}>
                                {complaint.status}
                            </span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-200">
                        {steps.map((step, index) => (
                            <div key={index} className="relative flex items-start group">
                                <div className={`absolute -left-[27px] w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${step.completed ? 'bg-[#138808] border-[#138808] text-white' :
                                    index === steps.findIndex(s => !s.completed) ? 'bg-white border-[#0B3D91] text-[#0B3D91]' :
                                        'bg-white border-slate-300 text-slate-300'
                                    }`}>
                                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                </div>
                                <div className="ml-4">
                                    <h4 className={`text-base font-bold ${step.completed ? 'text-slate-900' : index === steps.findIndex(s => !s.completed) ? 'text-[#0B3D91]' : 'text-slate-400'}`}>
                                        {step.label}
                                    </h4>
                                    <p className="text-sm text-slate-500 font-mono mt-0.5" suppressHydrationWarning>{step.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Photo Proof */}
                    {complaint.photoUrl && (
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-3">Submitted Photo Evidence</span>
                            <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-50 relative aspect-video w-full max-w-sm">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={complaint.photoUrl} alt="Submitted evidence" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}

                    {/* Details Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                            <Clock className="w-4 h-4 mr-2 text-[#0B3D91]" />
                            <span>Target SLA: <strong className="text-slate-900">{complaint.aiAnalysis.estimatedResolutionHours} Hours</strong></span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                            <FileText className="w-4 h-4 mr-2 text-[#0B3D91]" />
                            <span>Dept: <strong className="text-slate-900">{complaint.aiAnalysis.category_analysis.category}</strong></span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
