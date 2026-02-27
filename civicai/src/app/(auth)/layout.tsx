import { Landmark } from "lucide-react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#F3F4F6] flex flex-col relative overflow-hidden">
            {/* Formal Header */}
            <header className="absolute top-0 w-full bg-white border-b border-slate-200 shadow-sm z-20">
                <div className="h-2 w-full flex">
                    <div className="flex-1 bg-[#FF9933]"></div>
                    <div className="flex-1 bg-white"></div>
                    <div className="flex-1 bg-[#138808]"></div>
                </div>
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Landmark className="w-10 h-10 text-[#0B3D91]" />
                        <div>
                            <h1 className="text-xl font-bold text-[#0B3D91] tracking-tight">Public Grievance Intelligence System</h1>
                            <p className="text-sm text-slate-500 font-medium">Government of India Enterprise Digital Services</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Centered */}
            <div className="flex-1 flex items-center justify-center p-4 pt-28 relative z-10 w-full">
                {children}
            </div>

            {/* Formal Footer */}
            <footer className="absolute bottom-0 w-full py-6 text-center text-xs text-slate-500 font-medium z-20">
                © {new Date().getFullYear()} National Informatics Centre. Designed for Public Administration.
            </footer>
        </div>
    )
}
