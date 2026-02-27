"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { TopNav } from "./topnav"
import { Footer } from "./footer"

interface PortalWrapperProps {
    children: React.ReactNode
    userType: "citizen" | "department"
    userName: string
    userRole: string
}

export function PortalWrapper({ children, userType, userName, userRole }: PortalWrapperProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex overflow-hidden">
            <Sidebar
                type={userType}
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            <div
                className={`flex-1 flex flex-col pt-0 min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-64'}`}
            >
                <TopNav userName={userName} userRole={userRole} />

                <main className="flex-1 p-8 overflow-y-auto w-full">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    )
}
