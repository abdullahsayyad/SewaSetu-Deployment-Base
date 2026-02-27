import { UserCircle2, Landmark, Globe } from "lucide-react"
import { NotificationDropdown } from "./notification-dropdown"

export function TopNav({ userName, userRole }: { userName: string; userRole: string }) {
    return (
        <div className="flex flex-col sticky top-0 z-20 w-full bg-white border-b border-slate-200 shadow-sm">
            {/* Top Accessibility & Profile Bar - UIDAI style dark */}
            <div className="h-12 flex items-center justify-between px-4 md:px-8 bg-[#1e293b] text-white text-[11px] font-medium tracking-wide">
                <div className="flex items-center space-x-4">
                    <span className="opacity-90">GOVERNMENT OF INDIA</span>
                    <span className="hidden md:inline-block opacity-90 border-r border-slate-600 pr-4">MINISTRY OF ELECTRONICS & IT</span>
                    <span className="hidden sm:inline-block text-amber-400 font-bold tracking-wider">{userRole} Portal</span>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden xl:flex items-center space-x-4">
                        <button className="hover:text-amber-400 transition-colors">Skip to main content</button>
                        <button className="hover:text-amber-400 transition-colors">Screen Reader Access</button>
                        <div className="flex items-center space-x-2 border-l border-slate-600 pl-4">
                            <button className="px-1.5 hover:text-amber-400">A-</button>
                            <button className="px-1.5 font-bold">A</button>
                            <button className="px-1.5 hover:text-amber-400">A+</button>
                        </div>
                        <div className="flex items-center border-l border-slate-600 pl-4 space-x-1 hover:text-amber-400 cursor-pointer">
                            <Globe className="w-3.5 h-3.5 mr-1" />
                            <span>English</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 xl:border-l xl:border-slate-600 xl:pl-4">
                        <div className="bg-[#334155] rounded-md px-1.5 py-0.5">
                            <NotificationDropdown />
                        </div>

                        <div className="flex items-center space-x-2 cursor-pointer group">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                                    {userName}
                                </span>
                            </div>
                            <UserCircle2 className="w-6 h-6 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Identity Header - Dense White layout */}
            <div className="h-20 flex items-center justify-between px-4 md:px-8 bg-white">
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <Landmark className="w-8 h-8 text-[#0A3251] mr-3 hidden sm:block" />
                            <div>
                                <h1 className="text-xl md:text-2xl font-black text-[#0A3251] tracking-tight uppercase">
                                    SewaSetu
                                </h1>
                                <h2 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                    भारत सरकार / Government of India
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indian Tricolor Accent Strip */}
                <div className="hidden lg:flex h-12 w-1.5 rounded-full overflow-hidden flex-col ml-8">
                    <div className="flex-1 bg-[#FF9933]"></div>
                    <div className="flex-1 bg-white border-y border-slate-200"></div>
                    <div className="flex-1 bg-[#138808]"></div>
                </div>
            </div>
        </div>
    )
}
