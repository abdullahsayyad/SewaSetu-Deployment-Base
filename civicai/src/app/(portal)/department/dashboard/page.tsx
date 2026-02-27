"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { MetricCard } from "@/components/shared/metric-card"
import { Complaint } from "@/lib/data/mock-db"
import { getComplaints } from "@/app/actions/complaints"
import { AlertOctagon, CheckSquare, Clock, Users } from "lucide-react"

const COLORS = ["#0B3D91", "#138808", "#FF9933", "#475569", "#DC2626", "#F59E0B"]

export default function DepartmentDashboard() {
    const [department, setDepartment] = useState("Electricity")
    const [allComplaints, setAllComplaints] = useState<Complaint[]>([])

    useEffect(() => {
        const storedDept = localStorage.getItem("auth_department") || "Electricity"
        setDepartment(storedDept)
        getComplaints().then(setAllComplaints)
    }, [])

    // Filter for this specific department
    const deptComplaints = allComplaints.filter(c => c.departmentName === department)

    const activeCases = deptComplaints.filter(c => c.status !== "Resolved").length
    const resolvedCases = deptComplaints.filter(c => c.status === "Resolved").length
    const criticalAlerts = deptComplaints.filter(c => c.aiAnalysis.severity_analysis.severity_level === "Critical" && c.status !== "Resolved").length
    const totalCases = deptComplaints.length
    const resolutionRate = totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0

    // Derive resolution chart data from actual complaints grouped by day of week
    const resolutionData = (() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const counts: Record<string, { incoming: number; resolved: number }> = {}
        days.forEach(d => counts[d] = { incoming: 0, resolved: 0 })

        deptComplaints.forEach(c => {
            const day = days[new Date(c.createdAt).getDay()]
            counts[day].incoming += 1
            if (c.status === "Resolved") counts[day].resolved += 1
        })

        return days.map(name => ({ name, incoming: counts[name].incoming, resolved: counts[name].resolved }))
    })()

    // Derive category distribution from actual subcategories
    const categoryDistribution = (() => {
        const subcats: Record<string, number> = {}
        deptComplaints.forEach(c => {
            const sub = c.aiAnalysis.category_analysis.subcategory || "Other"
            subcats[sub] = (subcats[sub] || 0) + 1
        })
        return Object.entries(subcats)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
    })()

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#0B3D91] tracking-tight">{department} Department Operations</h2>
                    <p className="text-slate-600 mt-1">Live administrative dashboard for resource allocation and SLA monitoring.</p>
                </div>
            </div>

            {criticalAlerts > 0 && (
                <div className="border border-red-200 shadow-sm rounded-md overflow-hidden mb-6">
                    <div className="bg-[#cc0000] px-4 py-2 flex justify-between items-center text-white">
                        <div className="flex items-center space-x-1.5">
                            <AlertOctagon className="w-4 h-4" />
                            <span className="text-sm font-semibold tracking-wide">Critical Alert</span>
                        </div>
                        <span className="text-xs font-medium bg-black/20 px-2 py-0.5 rounded-sm">Action Required</span>
                    </div>
                    <div className="bg-[#fff1f0] p-4 flex items-start">
                        <div>
                            <h4 className="text-red-950 font-bold mb-1">{criticalAlerts} SLA Breach Warnings</h4>
                            <p className="text-red-800 text-sm">Emergency dispatch teams must be allocated to High-Risk issues immediately to avoid penalty points.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Active Cases"
                    value={activeCases}
                    icon={Users}
                />
                <MetricCard
                    title="Critical Alerts"
                    value={criticalAlerts}
                    icon={AlertOctagon}
                    critical={criticalAlerts > 0}
                />
                <MetricCard
                    title="Total Volume"
                    value={totalCases}
                    icon={Clock}
                />
                <MetricCard
                    title="Resolution Rate"
                    value={`${resolutionRate}%`}
                    icon={CheckSquare}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

                {/* Resolution vs Incoming Chart */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-md overflow-hidden" suppressHydrationWarning>
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#1e40af]">Cases by Day of Week</h3>
                    </div>
                    <div className="p-4 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={resolutionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", color: "#111827" }}
                                    itemStyle={{ color: "#111827" }}
                                />
                                <Bar dataKey="incoming" name="Reported" fill="#1e40af" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="resolved" name="Resolved" fill="#16a34a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-md overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#1e40af]">Issue Distribution Analytics</h3>
                    </div>
                    <div className="p-4 h-[300px] flex items-center justify-center">
                        {categoryDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                                        itemStyle={{ color: "#111827" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-slate-400 text-sm">No complaints yet for this department.</p>
                        )}
                    </div>
                    <div className="flex justify-center flex-wrap gap-4 mt-2">
                        {categoryDistribution.map((category, idx) => (
                            <div key={category.name} className="flex items-center text-xs text-slate-600 font-medium">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx] }}></div>
                                {category.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
