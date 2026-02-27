"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { MetricCard } from "@/components/shared/metric-card"
import { UpvoteFeedItem } from "@/components/shared/upvote-feed-item"
import { Complaint } from "@/lib/data/mock-db"
import { getComplaints } from "@/app/actions/complaints"
import { FileIcon, AlertTriangle, CheckSquare, Clock, ThumbsUp } from "lucide-react"

// Dynamically import the map so it only loads client-side
const CivicMap = dynamic(() => import("@/components/shared/civic-map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center">
            <div className="text-slate-500 font-medium">Initializing Locality Map...</div>
        </div>
    )
})

export default function CitizenDashboard() {
    const [complaints, setComplaints] = useState<Complaint[]>([])
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

    const userComplaints = complaints.filter(c => c.citizenId === citizenId)
    const activeIssues = userComplaints.filter(c => c.status !== "Resolved").length
    const criticalIssues = userComplaints.filter(c => c.aiAnalysis.severity_analysis.severity_level === "Critical" && c.status !== "Resolved").length
    const resolvedIssues = userComplaints.filter(c => c.status === "Resolved").length

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="bg-white border border-[#9CA3AF] p-4">
                <h2 className="text-xl font-bold text-[#1e40af] tracking-tight">Citizen Dashboard</h2>
                <p className="text-sm text-slate-600 mt-0.5">Overview of civic grievances in your registered locality.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Active Grievances"
                    value={activeIssues}
                    icon={FileIcon}
                    trend="up"
                    trendValue="12%"
                    description="vs last month"
                />
                <MetricCard
                    title="Critical Alerts"
                    value={criticalIssues}
                    icon={AlertTriangle}
                    critical={true}
                    description="Immediate action pending"
                />
                <MetricCard
                    title="Resolved Cases"
                    value={resolvedIssues}
                    icon={CheckSquare}
                    trend="up"
                    trendValue="24%"
                    description="Closure rate improving"
                />
                <MetricCard
                    title="Avg. Resolution"
                    value="48h"
                    icon={Clock}
                    trend="down"
                    trendValue="5h"
                    description="Faster than SLA"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-2 space-y-4">
                    <div className="bg-white border border-[#9CA3AF] overflow-hidden">
                        <div className="p-3 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-[#1e40af]">Locality Incident Map</h3>
                            <div className="flex space-x-2">
                                <button className="p-1 text-slate-400 hover:text-[#1e40af] transition-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </button>
                            </div>
                        </div>
                        {/* Wrap map in a container that forces a re-render if needed, but dynamic import handles it */}
                        <div className="w-full bg-slate-50 p-2">
                            <div className="overflow-hidden border border-[#9CA3AF] h-[500px]">
                                <CivicMap complaints={complaints} height="100%" currentUserId={citizenId} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 xl:col-span-1">
                    <div className="bg-white border border-[#9CA3AF] overflow-hidden flex flex-col h-[552px]">
                        <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-[#1e40af]">Community Upvotes</h3>
                            <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 rounded-full">Explore</span>
                        </div>
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            {complaints.filter(c => c.citizenId !== citizenId).map((complaint) => (
                                <UpvoteFeedItem key={complaint.id} complaint={complaint} currentUserId={citizenId} />
                            ))}
                            {complaints.filter(c => c.citizenId !== citizenId).length === 0 && (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    No community issues to upvote right now.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 xl:col-span-1">
                    <div className="bg-white border border-[#9CA3AF] overflow-hidden flex flex-col h-[552px]">
                        <div className="p-3 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-[#1e40af]">Recent Dockets</h3>
                            <button className="text-xs font-semibold text-[#1e40af] hover:underline">View All &gt;</button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            {complaints.filter(c => c.citizenId === citizenId).slice(0, 10).map((complaint) => (
                                <div key={complaint.id} className="p-4 border-b border-[#9CA3AF] last:border-0 hover:bg-slate-50 transition-none">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-slate-500 font-medium">{complaint.id}</span>
                                            {complaint.upvoteCount > 0 && (
                                                <span className="text-[10px] font-bold text-[#1e40af] bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                    <ThumbsUp className="w-2.5 h-2.5" />
                                                    {complaint.upvoteCount}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-semibold border px-2 py-0.5 uppercase tracking-wider ${complaint.status === 'Resolved' ? 'border-[#2b712b] bg-[#e2f0d9] text-[#2b712b]' : 'border-[#d69900] bg-[#fff2cc] text-[#d69900]'
                                            }`}>
                                            {complaint.status}
                                        </span>
                                    </div>
                                    <p className="font-semibold text-[#1e40af] text-sm mb-1 line-clamp-2">{complaint.aiAnalysis.category_analysis.subcategory}</p>
                                    <p className="text-xs text-slate-600 truncate flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-slate-400 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        <span className="truncate">{complaint.location.address || 'Mapped Area'}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
