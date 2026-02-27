"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Landmark, ArrowRight, ShieldCheck, Mail } from "lucide-react"
import { loginOfficer } from "@/app/actions/auth"

export default function DepartmentLogin() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [department, setDepartment] = useState("Electricity")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg("")
        setIsLoading(true)

        const res = await loginOfficer(department, email, password)

        if (res.success) {
            localStorage.setItem("auth_department", res.department as string)
            router.push("/department/dashboard")
        } else {
            setErrorMsg(res.error || "Authentication failed")
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">

            {/* Formal Header Section */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-8 text-center flex flex-col items-center">
                <Landmark className="w-12 h-12 text-[#138808] mb-4" />
                <h2 className="text-2xl font-bold text-[#0B3D91] tracking-tight">Department Portal</h2>
                <p className="text-slate-600 text-sm mt-2 max-w-xs leading-relaxed">Restricted access for Nodal Officers and Field Administrators.</p>
            </div>

            <div className="p-8">
                <form onSubmit={handleLogin} className="space-y-6">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                            {errorMsg}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Department <span className="text-red-600">*</span></label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent appearance-none"
                        >
                            <option value="Electricity">Electricity & Power</option>
                            <option value="Water">Water & Sanitation</option>
                            <option value="Roads">Roads & Infrastructure</option>
                            <option value="Sanitation">Sanitation & Waste</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">NIC Email / Official ID <span className="text-red-600">*</span></label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="officer@nic.in"
                                className="w-full bg-white border border-slate-300 rounded-md p-3 pl-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all placeholder:text-slate-400"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Secure Password <span className="text-red-600">*</span></label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white border border-slate-300 rounded-md p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#138808] hover:bg-[#138808]/90 text-white font-medium p-3 rounded-md flex items-center justify-center transition-colors group relative overflow-hidden"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Verifying Credentials...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <ShieldCheck className="w-5 h-5 mr-2" />
                                Access Dashboard
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm font-medium">
                    <span className="text-slate-600">Are you a citizen? </span>
                    <Link href="/citizen/login" className="text-[#0B3D91] hover:underline hover:text-[#0B3D91]/80 transition-colors">
                        Access Citizen Portal
                    </Link>
                </div>

                <div className="mt-6 text-center pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-500 max-w-[250px] mx-auto leading-relaxed">
                        Unauthorized access is prohibited and punishable under the IT Act, 2000.
                    </p>
                </div>
            </div>
        </div>
    )
}
