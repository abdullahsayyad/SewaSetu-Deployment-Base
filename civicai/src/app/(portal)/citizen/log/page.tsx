"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Upload, MapPin, CheckCircle2, ChevronRight, FileText } from "lucide-react"
import { analyzeGrievance, type AIAnalysisResult } from "@/lib/data/ai-engine"
import { useRouter } from "next/navigation"
import { logComplaint } from "@/app/actions/complaints"

export default function LogComplaint() {
    const router = useRouter()
    const [description, setDescription] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setPhotoDataUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleAnalyze = async () => {
        if (!description.trim()) return

        setIsProcessing(true)

        // Call real API
        try {
            const result = await analyzeGrievance(description)
            setAnalysis(result)
        } catch (e) {
            console.error("Failed to analyze grievance", e)
        } finally {
            setIsProcessing(false)
        }
    }

    const [generatedId, setGeneratedId] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!analysis || !description.trim()) return;
        setIsSubmitting(true)

        const { CITY_CENTER } = await import("@/lib/data/mock-db")

        // Generate a slight offset from the city center for the new map pin
        const latOffset = (Math.random() - 0.5) * 0.05
        const lngOffset = (Math.random() - 0.5) * 0.05

        const cId = localStorage.getItem("citizen_id") || undefined

        const res = await logComplaint({
            description,
            location: {
                lat: CITY_CENTER.lat + latOffset,
                lng: CITY_CENTER.lng + lngOffset
            },
            aiAnalysis: analysis,
            photoDataUrl
        }, cId)

        if (res.success) {
            setGeneratedId(res.docketId as string)
            setSuccess(true)
            setIsSubmitting(false)

            // Redirect to history ledger after viewing the success message
            setTimeout(() => {
                router.push("/citizen/history")
            }, 2500)
        } else {
            console.error("Failed to log complaint:", res.error)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-[#0B3D91] tracking-tight">File a New Grievance</h2>
                <p className="text-slate-600 mt-1">Describe your issue. Our AI engine will automatically route it to the correct department.</p>
            </div>

            {success ? (
                <div className="bg-white border border-green-200 p-12 rounded-lg flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500 shadow-sm">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0B3D91]">Grievance Logged Successfully</h3>
                    <p className="text-slate-600 text-center max-w-md">Your complaint has been processed and routed to the {analysis?.category_analysis.category} department. You will receive SMS updates.</p>
                    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-center">
                        <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Docket Number</span>
                        <span className="font-mono font-bold text-lg text-[#0B3D91]">{generatedId}</span>
                    </div>
                </div>
            ) : (

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="bg-white p-4 border border-[#9CA3AF] space-y-4 relative overflow-hidden">
                            {isProcessing && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                                    <BrainCircuit className="w-10 h-10 text-[#0B3D91] animate-pulse mb-3" />
                                    <span className="text-sm font-semibold text-[#0B3D91] tracking-wider uppercase">Processing NLP Analysis...</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-slate-500" /> Issue Description <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="E.g., There is a large pothole on Main Street causing massive traffic blocks and accidents..."
                                    className="w-full h-32 bg-white border border-[#9CA3AF] p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0B3D91] transition-none placeholder:text-slate-400 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative border border-dashed border-[#9CA3AF] p-3 text-center hover:bg-slate-50 transition-none cursor-pointer group overflow-hidden bg-slate-50">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {photoDataUrl ? (
                                        <div className="absolute inset-0 w-full h-full">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={photoDataUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-none">
                                                <span className="text-white text-xs font-bold">Change Photo</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1 group-hover:text-[#0B3D91] transition-none" />
                                            <span className="text-xs font-medium text-slate-600">Upload Photo (Proof)</span>
                                        </>
                                    )}
                                </div>
                                <div className="border border-[#9CA3AF] p-3 text-center hover:bg-slate-50 transition-none cursor-pointer group bg-slate-50">
                                    <MapPin className="w-5 h-5 text-[#0B3D91] mx-auto mb-1" />
                                    <span className="text-xs font-semibold text-[#0B3D91]">Location Detected</span>
                                    <span className="block text-[10px] text-slate-500 mt-1">Sector 4, Central District</span>
                                </div>
                            </div>

                            <Button
                                className="w-full mt-4"
                                size="lg"
                                onClick={handleAnalyze}
                                disabled={!description.trim() || isProcessing}
                            >
                                Analyze & Route Grievance <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* AI Output Section */}
                    <div className="space-y-6">
                        {analysis ? (
                            <div className="bg-white p-5 border border-[#9CA3AF]">
                                <div className="flex items-center mb-5 pb-3 border-b border-slate-200 relative">
                                    <div className="absolute right-0 top-0">
                                        <Badge variant={
                                            analysis.severity_analysis.severity_level === "Critical" ? "critical" :
                                                analysis.severity_analysis.severity_level === "High" ? "high" :
                                                    analysis.severity_analysis.severity_level === "Medium" ? "moderate" : "low"
                                        }>
                                            {analysis.severity_analysis.severity_level} Priority
                                        </Badge>
                                    </div>
                                    <BrainCircuit className="w-6 h-6 text-[#0B3D91] mr-3" />
                                    <div>
                                        <h3 className="font-bold text-[#0B3D91]">Intelligence Report</h3>
                                        <span className="text-xs text-slate-500">System-generated categorization</span>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Routed Department</span>
                                        <p className="text-lg font-semibold text-slate-900">{analysis.category_analysis.category}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Sub-Category</span>
                                            <p className="font-medium text-slate-800">{analysis.category_analysis.subcategory}</p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Target SLA</span>
                                            <p className="font-medium text-slate-800">{analysis.estimatedResolutionHours} Hours</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-2">Escalation Score</span>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                                            <div className={`h-2.5 rounded-full ${analysis.priority_scoring.priority_score > 75 ? 'bg-red-600' :
                                                analysis.priority_scoring.priority_score > 50 ? 'bg-orange-500' :
                                                    analysis.priority_scoring.priority_score > 25 ? 'bg-yellow-500' : 'bg-green-600'
                                                }`} style={{ width: `${analysis.priority_scoring.priority_score}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                                            <span>0</span>
                                            <span className="font-bold">{analysis.priority_scoring.priority_score}/100</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#0B3D91]/5 border-l-4 border-[#0B3D91] p-4 text-sm text-slate-700">
                                        <strong>Extracted Action:</strong> {analysis.suggestedAction}
                                    </div>

                                    <Button
                                        className="w-full bg-[#138808] hover:bg-[#138808]/90 text-white mt-4"
                                        size="lg"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting to National Grid..." : "Confirm & Lodge Docket"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-[#9CA3AF] p-10 text-center flex flex-col items-center justify-center h-full border-dashed">
                                <BrainCircuit className="w-10 h-10 text-slate-300 mb-3" />
                                <h3 className="text-lg font-semibold text-slate-700">Awaiting Input</h3>
                                <p className="text-sm text-slate-500 max-w-xs mt-1">Enter your grievance details and click analyze to see how the system processes your request.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
