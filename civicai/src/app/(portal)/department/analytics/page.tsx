"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"
import { MetricCard } from "@/components/shared/metric-card"
import { Complaint } from "@/lib/data/mock-db"
import { getComplaints } from "@/app/actions/complaints"
import { BarChart as BarChartIcon, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react"

const COLORS = ["#0B3D91", "#138808", "#FF9933", "#475569", "#DC2626", "#F59E0B"]

export default function AnalyticsDashboard() {
    const [department, setDepartment] = useState("Electricity")
    const [allComplaints, setAllComplaints] = useState<Complaint[]>([])

    useEffect(() => {
        const storedDept = localStorage.getItem("auth_department") || "Electricity"
        setDepartment(storedDept)
        getComplaints().then(setAllComplaints)
    }, [])

    // Analytics Processing
    const deptComplaints = allComplaints.filter(c => c.departmentName === department)

    // 1. Basic Counts
    const totalCount = deptComplaints.length
    const resolvedCount = deptComplaints.filter(c => c.status === "Resolved").length
    const criticalCount = deptComplaints.filter(c => c.aiAnalysis.severity_analysis.severity_level === "Critical").length

    const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0

    // 2. Subcategory Distribution for Pie Chart
    const subcats = deptComplaints.reduce((acc, c) => {
        const cat = c.aiAnalysis.category_analysis.subcategory || "Other"
        acc[cat] = (acc[cat] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const categoryData = Object.entries(subcats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5) // Top 5

    // 3. Risk Level Distribution
    const riskLevels = deptComplaints.reduce((acc, c) => {
        const risk = c.aiAnalysis.severity_analysis.severity_level || "Low"
        acc[risk] = (acc[risk] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const riskData = Object.entries(riskLevels).map(([name, value]) => ({ name, value }))

    // 4. Timeline Data — group actual complaints by day over last 7 days
    const timelineData = (() => {
        const result: { name: string; incoming: number; resolved: number }[] = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' })
            const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
            const dayEnd = new Date(dayStart.getTime() + 86400000)

            const incoming = deptComplaints.filter(c => {
                const t = new Date(c.createdAt)
                return t >= dayStart && t < dayEnd
            }).length

            const resolved = deptComplaints.filter(c => {
                if (c.status !== "Resolved") return false
                const t = new Date(c.createdAt)
                return t >= dayStart && t < dayEnd
            }).length

            result.push({ name: dayStr, incoming, resolved })
        }
        return result
    })()


    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8 border-b border-[#9CA3AF] pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#0B3D91] tracking-tight">{department} Analytics</h2>
                    <p className="text-slate-700 mt-1">Comprehensive data insights and SLA reporting.</p>
                </div>
            </div>

            {/* Top Metrics Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Volume"
                    value={totalCount}
                    icon={BarChartIcon}
                />
                <MetricCard
                    title="Resolution Rate"
                    value={`${resolutionRate}%`}
                    icon={CheckCircle2}
                    trend="up"
                    trendValue="2%"
                />
                <MetricCard
                    title="Critical Escalations"
                    value={criticalCount}
                    icon={AlertTriangle}
                    critical={criticalCount > 0}
                />
                <MetricCard
                    title="MoM Growth"
                    value="+12%"
                    icon={TrendingUp}
                    trend="up"
                    trendValue="Consistent"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

                {/* 7-Day Performance Trend */}
                <div className="bg-white border border-[#9CA3AF] overflow-hidden" suppressHydrationWarning>
                    <div className="p-3 border-b border-[#9CA3AF] flex justify-between items-center bg-white">
                        <h3 className="text-lg font-bold text-[#1e40af]">7-Day Ticket Velocity</h3>
                    </div>
                    <div className="p-4 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="incoming" stroke="#0B3D91" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="New Tickets" />
                                <Line type="monotone" dataKey="resolved" stroke="#138808" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Resolved" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sub-Category Distribution */}
                <div className="bg-white border border-[#9CA3AF] overflow-hidden">
                    <div className="p-3 border-b border-[#9CA3AF] flex justify-between items-center bg-white">
                        <h3 className="text-lg font-bold text-[#1e40af]">Primary Issue Clusters</h3>
                    </div>
                    <div className="p-4 h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                                />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Level Bar Chart */}
                <div className="bg-white border border-[#9CA3AF] overflow-hidden lg:col-span-2">
                    <div className="p-3 border-b border-[#9CA3AF] flex justify-between items-center bg-white">
                        <h3 className="text-lg font-bold text-[#1e40af]">AI Risk Assessment Breakdown</h3>
                    </div>
                    <div className="p-4 h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                                <XAxis type="number" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                                />
                                <Bar dataKey="value" fill="#FF9933" radius={[0, 4, 4, 0]}>
                                    {riskData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                entry.name === 'Critical' ? '#DC2626' :
                                                    entry.name === 'High' ? '#EA580C' :
                                                        entry.name === 'Medium' ? '#EAB308' : '#10B981'
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    )
}
