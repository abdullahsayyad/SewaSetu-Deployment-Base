"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    Landmark,
    LayoutDashboard,
    Map,
    FileWarning,
    AlertTriangle,
    CheckCircle,
    BarChart3,
    MapPin,
    Clock,
    LogOut,
    Send,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarProps {
    type: "citizen" | "department"
    isCollapsed: boolean
    toggleCollapse: () => void
}

export function Sidebar({ type, isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname()

    const citizenLinks = [
        { name: "My Dashboard", href: "/citizen/dashboard", icon: MapPin },
        { name: "Complaint History", href: "/citizen/history", icon: Clock },
        { name: "Log Complaint", href: "/citizen/log", icon: Send },
    ]

    const departmentLinks = [
        { name: "Dashboard", href: "/department/dashboard", icon: LayoutDashboard },
        { name: "Regional Map", href: "/department/map", icon: Map },
        { name: "Incoming Dockets", href: "/department/incoming", icon: FileWarning },
        { name: "Escalated Alerts", href: "/department/alerts", icon: AlertTriangle },
        { name: "Resolved Repository", href: "/department/resolved", icon: CheckCircle },
        { name: "Analytics", href: "/department/analytics", icon: BarChart3 },
    ]

    const links = type === "citizen" ? citizenLinks : departmentLinks

    return (
        <TooltipProvider delayDuration={0}>
            <div className={cn(
                "bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-30 shadow-sm transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64"
            )}>
                {/* Header / Logo Area */}
                <div className="h-[128px] relative flex flex-col items-center justify-center px-4 border-b border-slate-200 bg-slate-50 transition-all">
                    <button
                        onClick={toggleCollapse}
                        className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-500 hover:text-[#0B3D91] hover:bg-slate-50 transition-colors z-40"
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>

                    <Landmark className={cn("text-[#0B3D91] transition-all", isCollapsed ? "w-8 h-8 mb-0" : "w-10 h-10 mb-2")} />

                    {!isCollapsed && (
                        <span className="text-xl font-bold text-[#0B3D91] text-center leading-tight animate-in fade-in duration-300">
                            National<br />Grievance Portal
                        </span>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
                    {!isCollapsed && (
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3 animate-in fade-in duration-300 whitespace-nowrap">
                            {type === 'citizen' ? 'Citizen Services' : 'Department Ops'}
                        </div>
                    )}

                    {links.map((link) => {
                        const isActive = pathname === link.href
                        const Icon = link.icon

                        const NavLink = (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex items-center rounded-md transition-colors group relative",
                                    isCollapsed ? "justify-center p-3" : "px-3 py-2.5 space-x-3",
                                    isActive
                                        ? "bg-[#0B3D91] text-white shadow-sm font-medium"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-[#0B3D91]")} />
                                {!isCollapsed && (
                                    <span className="text-sm whitespace-nowrap animate-in fade-in duration-300">{link.name}</span>
                                )}
                            </Link>
                        )

                        if (isCollapsed) {
                            return (
                                <Tooltip key={link.name}>
                                    <TooltipTrigger asChild>
                                        {NavLink}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-[#0B3D91] text-white font-medium border-none ml-2">
                                        {link.name}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        }

                        return NavLink;
                    })}
                </div>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <Tooltip open={isCollapsed ? undefined : false}>
                        <TooltipTrigger asChild>
                            <Link
                                href={`/${type}/login`}
                                className={cn(
                                    "flex items-center rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors",
                                    isCollapsed ? "justify-center p-2" : "px-3 py-2.5 space-x-3"
                                )}
                            >
                                <LogOut className="w-5 h-5 shrink-0" />
                                {!isCollapsed && <span className="text-sm whitespace-nowrap animate-in fade-in duration-300">Secure Logout</span>}
                            </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right" className="bg-red-600 text-white font-medium border-none ml-2">
                                Secure Logout
                            </TooltipContent>
                        )}
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    )
}
