import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
    title: string
    value: string | number
    description?: string
    icon?: LucideIcon
    trend?: "up" | "down" | "neutral"
    trendValue?: string
    critical?: boolean
}

export function MetricCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    trendValue,
    critical = false,
}: MetricCardProps) {
    return (
        <Card className={`overflow-hidden rounded-md border shadow-sm ${critical ? "border-red-200" : "border-slate-200"}`}>
            {/* Header Area */}
            {critical ? (
                <div className="bg-[#cc0000] px-4 py-2 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-1.5">
                        {Icon && <Icon className="w-4 h-4" />}
                        <span className="text-sm font-semibold tracking-wide">Warning</span>
                    </div>
                    <span className="text-xs font-medium bg-black/20 px-2 py-0.5 rounded-sm">Just Now</span>
                </div>
            ) : (
                <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1e40af] tracking-wide">{title}</span>
                    {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                </div>
            )}

            {/* Content Area */}
            <CardContent className={`p-4 ${critical ? "bg-[#ffege6]" : "bg-white"}`}>
                {critical && <h4 className="text-md font-bold text-red-950 mb-1">{title}</h4>}

                <div className="flex justify-between items-end mt-1">
                    <h3 className={`text-3xl font-bold tracking-tight ${critical ? "text-red-800" : "text-slate-800"}`}>
                        {value}
                    </h3>
                </div>

                {(description || trendValue) && (
                    <div className="mt-3 flex items-center text-xs">
                        {trendValue && (
                            <span
                                className={`mr-1.5 font-bold ${trend === "up" && critical
                                    ? "text-red-700"
                                    : trend === "up" && !critical
                                        ? "text-green-600"
                                        : trend === "down"
                                            ? "text-green-600"
                                            : "text-slate-500"
                                    }`}
                            >
                                {trend === "up" ? "↑" : trend === "down" ? "↓" : "−"} {trendValue}
                            </span>
                        )}
                        {description && <span className={`${critical ? "text-red-700/80" : "text-slate-500"}`}>{description}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
