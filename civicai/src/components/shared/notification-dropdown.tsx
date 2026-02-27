"use client"

import { useState } from "react"
import { Bell, CheckCircle2, ShieldAlert, AlertTriangle } from "lucide-react"
import { MOCK_NOTIFICATIONS } from "@/lib/data/mock-db"

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

    const unreadCount = notifications.filter(n => !n.read).length

    const getIcon = (type: string) => {
        switch (type) {
            case "critical": return <ShieldAlert className="w-5 h-5 text-[#DC2626]" /> // Solid Red
            case "warning": return <AlertTriangle className="w-5 h-5 text-[#EA580C]" /> // Solid Orange
            default: return <CheckCircle2 className="w-5 h-5 text-[#0B3D91]" /> // Solid Navy
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:text-[#0B3D91] transition-colors rounded-full hover:bg-slate-100"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#DC2626] rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white hidden">{unreadCount}</span>
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <span className="font-bold text-[#0B3D91]">Official Notifications</span>
                            <button
                                className="text-xs text-[#0B3D91] hover:text-[#0B3D91]/80 font-semibold"
                                onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                            >
                                Acknowledge All
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${!notif.read ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className={`mt-0.5 p-2 rounded-md border ${notif.type === 'critical' ? 'bg-red-50 border-red-200' :
                                        notif.type === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
                                        }`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h5 className={`text-sm font-bold ${!notif.read ? 'text-[#0B3D91]' : 'text-slate-700'}`}>
                                                {notif.title}
                                            </h5>
                                        </div>
                                        <p className="text-xs text-slate-600 mb-2 leading-relaxed">{notif.message}</p>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{notif.time}</span>
                                    </div>
                                </div>
                            ))}
                            {notifications.length === 0 && (
                                <div className="p-8 text-center text-slate-500 text-sm font-medium bg-slate-50">
                                    No pending administrative actions.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
