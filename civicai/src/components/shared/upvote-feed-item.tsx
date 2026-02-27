"use client"

import { useState, useTransition, useEffect } from "react"
import { Complaint } from "@/lib/data/mock-db"
import { toggleUpvote } from "@/app/actions/complaints"
import { ThumbsUp } from "lucide-react"

export function UpvoteFeedItem({ complaint, currentUserId }: { complaint: Complaint, currentUserId: string | null }) {
    const [isPending, startTransition] = useTransition()
    const [optimisticUpvotes, setOptimisticUpvotes] = useState(complaint.upvoteCount || 0)
    const [optimisticHasUpvoted, setOptimisticHasUpvoted] = useState(complaint.hasUpvoted || false)

    useEffect(() => {
        setOptimisticUpvotes(complaint.upvoteCount || 0)
        setOptimisticHasUpvoted(complaint.hasUpvoted || false)
    }, [complaint.upvoteCount, complaint.hasUpvoted])

    const handleUpvote = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!currentUserId) return

        const newHasUpvoted = !optimisticHasUpvoted
        setOptimisticHasUpvoted(newHasUpvoted)
        setOptimisticUpvotes(prev => newHasUpvoted ? prev + 1 : prev - 1)

        startTransition(async () => {
            const res = await toggleUpvote(complaint.id, currentUserId)
            if (!res?.success) {
                // Revert if error
                setOptimisticHasUpvoted(!newHasUpvoted)
                setOptimisticUpvotes(prev => !newHasUpvoted ? prev + 1 : prev - 1)
            }
        })
    }

    return (
        <div className="p-4 border-b border-[#9CA3AF] last:border-0 hover:bg-slate-50 transition-none flex flex-col justify-between h-auto gap-3">
            <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-mono text-slate-500 font-medium">{complaint.id}</span>
                <span className={`text-[10px] font-semibold border px-2 py-0.5 uppercase tracking-wider ${complaint.aiAnalysis.severity_analysis.severity_level === 'Critical' ? 'border-[#dc2626] bg-[#fef2f2] text-[#dc2626]' :
                        complaint.aiAnalysis.severity_analysis.severity_level === 'High' ? 'border-[#ea580c] bg-[#fff7ed] text-[#ea580c]' :
                            'border-[#ca8a04] bg-[#fefce8] text-[#ca8a04]'
                    }`}>
                    {complaint.aiAnalysis.severity_analysis.severity_level}
                </span>
            </div>

            <div>
                <h4 className="font-semibold text-[#1e40af] text-sm mb-1 leading-tight">{complaint.aiAnalysis.category_analysis.category}</h4>
                <p className="text-xs text-slate-600 whitespace-normal break-words line-clamp-2">{complaint.description}</p>
            </div>

            <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-500 truncate flex items-center max-w-[60%]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-slate-400 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span className="truncate">{complaint.location.address || 'Location Area'}</span>
                </p>
                <button
                    onClick={handleUpvote}
                    disabled={isPending || !currentUserId}
                    className={`flex items-center space-x-1.5 py-1 px-2 rounded border text-xs font-bold transition-colors ${optimisticHasUpvoted ? 'bg-[#1e40af] text-white border-[#1e40af]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                        }`}
                >
                    <ThumbsUp className={`w-3.5 h-3.5 ${optimisticHasUpvoted ? 'fill-current' : ''}`} />
                    <span>{optimisticUpvotes}</span>
                </button>
            </div>
        </div>
    )
}
