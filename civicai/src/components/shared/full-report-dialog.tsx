"use client"

import { Complaint } from "@/lib/data/mock-db"
import { ShieldAlert, X, AlignLeft, BrainCircuit, Activity, AlertTriangle, FileText, CheckCircle2, ChevronRight, Hash } from "lucide-react"

interface FullReportDialogProps {
    complaint: Complaint | null
    onClose: () => void
}

export function FullReportDialog({ complaint, onClose }: FullReportDialogProps) {
    if (!complaint) return null

    const formatDate = (ds: string) => {
        return new Date(ds).toLocaleString('en-IN', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-300 rounded-lg animate-in zoom-in-95 duration-200">

                {/* Header (Official NIC Style) */}
                <div className="bg-[#0B3D91] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#ff9933] shrink-0">
                    <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-white/80" />
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Full Intelligence Report</h2>
                            <p className="text-white/70 text-xs font-mono tracking-wider">RESTRICTED TO LEVEL-3 NODAL OFFICERS</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" aria-label="Close dialog">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-0 overflow-y-auto flex-1 bg-slate-50">

                    {/* Top Metadata Row */}
                    <div className="bg-white border-b border-slate-200 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="border-r border-slate-100 pr-4">
                            <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">Docket Reference</span>
                            <div className="flex items-center text-slate-900 font-mono font-bold text-sm sm:text-base">
                                <Hash className="w-4 h-4 mr-1 text-slate-400" />
                                {complaint.id}
                            </div>
                        </div>
                        <div className="border-r border-slate-100 pr-4">
                            <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">Time Logged</span>
                            <span className="text-slate-900 font-medium text-sm sm:text-base" suppressHydrationWarning>{formatDate(complaint.createdAt)}</span>
                        </div>
                        <div className="border-r border-slate-100 pr-4">
                            <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">Department</span>
                            <span className="text-slate-900 font-medium text-sm sm:text-base">{complaint.aiAnalysis.category_analysis.category}</span>
                        </div>
                        <div>
                            <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">Sub-Category</span>
                            <span className="text-slate-900 font-medium text-sm sm:text-base">{complaint.aiAnalysis.category_analysis.subcategory}</span>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column: Core Grievance */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Original Text Section */}
                            <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                                <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center">
                                    <AlignLeft className="w-4 h-4 text-slate-500 mr-2" />
                                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Citizen Statement</h3>
                                </div>
                                <div className="p-5">
                                    <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap font-serif">
                                        &quot;{complaint.description}&quot;
                                    </p>
                                </div>
                            </div>

                            {/* Photo Evidence Section */}
                            {complaint.photoUrl && (
                                <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                                    <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center">
                                        <FileText className="w-4 h-4 text-slate-500 mr-2" />
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Submitted Evidence</h3>
                                    </div>
                                    <div className="p-4 bg-slate-50">
                                        <div className="border border-slate-200 rounded-md overflow-hidden bg-white relative aspect-video w-full max-w-lg mx-auto shadow-sm">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={complaint.photoUrl} alt="Submitted evidence" className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AI Extraction Section */}
                            <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                                <div className="bg-[#0B3D91]/5 border-b border-slate-200 px-4 py-3 flex items-center">
                                    <BrainCircuit className="w-4 h-4 text-[#0B3D91] mr-2" />
                                    <h3 className="text-sm font-bold text-[#0B3D91] uppercase tracking-wider">AI Semantic Extraction</h3>
                                </div>
                                <div className="p-5 space-y-5">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Generated Synopsis</h4>
                                        <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded border border-slate-100 leading-relaxed">
                                            {complaint.aiAnalysis.summary}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prescribed Action Protocol</h4>
                                        <div className="flex items-start bg-green-50 text-green-800 p-3 rounded border border-green-100">
                                            <CheckCircle2 className="w-5 h-5 mr-2 shrink-0 text-green-600 mt-0.5" />
                                            <p className="font-semibold">{complaint.aiAnalysis.suggestedAction}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Entity Extraction (Keywords)</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {complaint.aiAnalysis.extracted_keywords && complaint.aiAnalysis.extracted_keywords.map((kw, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded text-sm font-medium">
                                                    {kw}
                                                </span>
                                            ))}
                                            {!complaint.aiAnalysis.extracted_keywords?.length && <span className="text-sm text-slate-500 italic">No entities extracted.</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Analytics & Risk */}
                        <div className="space-y-6">

                            {/* Threat Matrix */}
                            <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                                <div className={`px-4 py-3 flex items-center border-b ${complaint.aiAnalysis.severity_analysis.severity_level === 'Critical' ? 'bg-red-50 border-red-100' : 'bg-slate-100 border-slate-200'
                                    }`}>
                                    <AlertTriangle className={`w-4 h-4 mr-2 ${complaint.aiAnalysis.severity_analysis.severity_level === 'Critical' ? 'text-red-600' : 'text-slate-500'}`} />
                                    <h3 className={`text-sm font-bold uppercase tracking-wider ${complaint.aiAnalysis.severity_analysis.severity_level === 'Critical' ? 'text-red-700' : 'text-slate-700'
                                        }`}>Risk Matrix</h3>
                                </div>
                                <div className="p-4 space-y-4">



                                    <div>
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Severity Classification</span>
                                            <span className={`text-sm font-bold uppercase ${complaint.aiAnalysis.severity_analysis.severity_level === 'Critical' ? 'text-red-600' :
                                                complaint.aiAnalysis.severity_analysis.severity_level === 'High' ? 'text-orange-600' :
                                                    complaint.aiAnalysis.severity_analysis.severity_level === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                {complaint.aiAnalysis.severity_analysis.severity_level}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tone Sentiment</span>
                                            <span className="text-sm font-bold text-slate-900">
                                                {complaint.aiAnalysis.sentiment_analysis.sentiment_score < -0.7 ? "Highly Negative" :
                                                    complaint.aiAnalysis.sentiment_analysis.sentiment_score < -0.3 ? "Negative" : "Neutral/Positive"}
                                                <span className="text-slate-400 font-mono ml-1">({complaint.aiAnalysis.sentiment_analysis.sentiment_score.toFixed(2)})</span>
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Geo Location Stub */}
                            <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                                <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center">
                                    <ShieldAlert className="w-4 h-4 text-slate-500 mr-2" />
                                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Spatial Data</h3>
                                </div>
                                <div className="p-4 bg-slate-50">
                                    <div className="border border-dashed border-slate-300 rounded bg-slate-100 p-4 flex flex-col items-center justify-center text-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">Coordinates Captured</span>
                                        <div className="font-mono text-sm text-[#0B3D91] bg-white px-3 py-1 border border-[#0B3D91]/20 rounded shadow-sm">
                                            {complaint.location.lat.toFixed(4)} N, {complaint.location.lng.toFixed(4)} E
                                        </div>
                                        <button className="mt-4 text-xs font-bold flex items-center text-[#0B3D91] hover:underline">
                                            View on Regional Map <ChevronRight className="w-3 h-3 ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}
