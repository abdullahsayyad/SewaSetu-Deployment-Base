"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Landmark, ArrowRight, ShieldCheck } from "lucide-react"
import { loginCitizen } from "@/app/actions/auth"

export default function CitizenLogin() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [identifier, setIdentifier] = useState("")
    const [otp, setOtp] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg("")
        setIsLoading(true)

        const res = await loginCitizen(identifier, otp)

        if (res.success && res.userId) {
            localStorage.setItem("citizen_id", res.userId)
            router.push("/citizen/dashboard")
        } else {
            setErrorMsg(res.error || "Authentication failed")
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">

            {/* Formal Header Section */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-8 text-center flex flex-col items-center">
                <Landmark className="w-12 h-12 text-[#0B3D91] mb-4" />
                <h2 className="text-2xl font-bold text-[#0B3D91] tracking-tight">Citizen Authentication</h2>
                <p className="text-slate-600 text-sm mt-2 max-w-xs leading-relaxed">Login via National Secure Gateway to file and monitor civic grievances.</p>
            </div>

            <div className="p-8">
                <form onSubmit={handleLogin} className="space-y-6">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                            {errorMsg}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Aadhaar / Mobile Number <span className="text-red-600">*</span></label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Enter 10-digit number"
                            className="w-full bg-white border border-slate-300 rounded-md p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">OTP Verification <span className="text-red-600">*</span></label>
                        <div className="flex space-x-2">
                            <input
                                type="password"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="000000"
                                className="flex-1 bg-white border border-slate-300 rounded-md p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                                required
                            />
                            <button type="button" className="px-4 py-3 bg-slate-100 text-[#0B3D91] font-semibold border border-slate-300 rounded-md hover:bg-slate-200 transition-colors text-sm whitespace-nowrap">
                                Request OTP
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#0B3D91] hover:bg-[#0B3D91]/90 text-white font-medium p-3 rounded-md flex items-center justify-center transition-colors group relative overflow-hidden"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Authenticating Session...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <ShieldCheck className="w-5 h-5 mr-2" />
                                Secure Login
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push("/department/login")}
                        className="text-sm text-slate-600 hover:text-[#0B3D91] font-medium transition-colors"
                    >
                        Official Access →
                    </button>
                </div>
            </div>
        </div>
    )
}
