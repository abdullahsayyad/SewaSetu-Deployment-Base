import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, UploadCloud, FileText } from "lucide-react"

interface ResolutionModalProps {
    complaintId: string;
    isOpen: boolean;
    onClose: () => void;
    onResolve: (notes: string) => void;
}

export function ResolutionModal({ complaintId, isOpen, onClose, onResolve }: ResolutionModalProps) {
    const [notes, setNotes] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate upload and resolution process
        setTimeout(() => {
            setSuccess(true)
            setIsSubmitting(false)

            setTimeout(() => {
                setSuccess(false)
                onResolve(notes)
                onClose()
            }, 1500)
        }, 1500)
    }

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
            <Card className="w-full max-w-lg border-slate-200 bg-white shadow-xl relative overflow-hidden">

                {success ? (
                    <div className="flex flex-col items-center justify-center h-[400px] space-y-4 bg-slate-50">
                        <div className="w-24 h-24 bg-green-50 border border-green-200 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-12 h-12 text-[#16A34A]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#0B3D91] tracking-tight">Docket Resolved</h3>
                        <p className="text-slate-600 font-medium text-center px-8">Synchronizing ledger across National Registry and notifying citizen.</p>
                    </div>
                ) : (
                    <>
                        <CardHeader className="border-b border-slate-200 pb-4 bg-slate-50">
                            <CardTitle className="text-xl text-[#0B3D91] font-bold">Log Official Resolution: {complaintId}</CardTitle>
                            <CardDescription className="text-slate-600 font-medium">Document verified field action to close this docket.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center uppercase tracking-wider">
                                        <FileText className="w-4 h-4 mr-2 text-slate-500" /> Action Taken <span className="text-red-600 ml-1">*</span>
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Describe how the administrative issue was rectified according to SLA..."
                                        className="w-full h-32 bg-white border border-slate-300 rounded-md p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] transition-all placeholder:text-slate-400 resize-none font-medium"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center uppercase tracking-wider">
                                        <UploadCloud className="w-4 h-4 mr-2 text-slate-500" /> Proof of Work (Evidence)
                                    </label>
                                    <div className="border-2 border-dashed border-slate-300 rounded-md p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                                        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-[#0B3D91] transition-colors" />
                                        <p className="text-sm font-medium text-slate-600 group-hover:text-[#0B3D91] transition-colors">Click to attach post-work photographic proof.</p>
                                        <span className="block text-xs text-slate-500 mt-2">JPG, PNG (Max 5MB)</span>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                                    <Button type="button" variant="outline" className="border-slate-300 font-bold text-slate-700" onClick={onClose} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white font-bold" disabled={isSubmitting || !notes.trim()}>
                                        {isSubmitting ? "Committing to Ledger..." : "Commit Resolution"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    )
}
