"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Complaint, CITY_CENTER } from "@/lib/data/mock-db"
import { Badge } from "@/components/ui/badge"

// Map styling for different priorities - Formal GOI solid styles
const createIcon = (color: string) => {
    return L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
            width: 16px; 
            height: 16px; 
            background: ${color}; 
            border-radius: 50%; 
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    })
}

const icons = {
    Critical: createIcon("#DC2626"), // Solid Red
    High: createIcon("#EA580C"),     // Solid Orange
    Medium: createIcon("#CA8A04"),   // Solid Yellow
    Moderate: createIcon("#CA8A04"), // Solid Yellow
    Low: createIcon("#16A34A"),      // Solid Green
}

interface CivicMapProps {
    complaints: Complaint[]
    zoom?: number
    height?: string
    currentUserId?: string | null
}

export default function CivicMap({ complaints, zoom = 13, height = "500px", currentUserId }: CivicMapProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Fix Leaflet's default icon path issues in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })
    }, [])

    if (!mounted) {
        return (
            <div
                className="w-full bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center flex-col space-y-4"
                style={{ height }}
            >
                <div className="w-8 h-8 border-4 border-[#0B3D91] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading Geographical Data...</p>
            </div>
        )
    }

    return (
        <div className="rounded-md overflow-hidden border border-slate-200 shadow-sm relative z-0" style={{ height, width: "100%" }}>
            <MapContainer
                center={[CITY_CENTER.lat, CITY_CENTER.lng]}
                zoom={zoom}
                style={{ height, width: "100%" }}
                className="z-0"
                dragging={false}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Highlight Municipal Hotspot Zones */}
                <Circle center={[22.7180, 75.8550]} pathOptions={{ fillColor: '#DC2626', fillOpacity: 0.15, color: '#DC2626', weight: 1 }} radius={2500} /> {/* Central Rajwada Zone */}
                <Circle center={[22.7533, 75.8937]} pathOptions={{ fillColor: '#EA580C', fillOpacity: 0.15, color: '#EA580C', weight: 1 }} radius={2000} /> {/* Northern Vijay Nagar Zone */}
                <Circle center={[22.6916, 75.8672]} pathOptions={{ fillColor: '#CA8A04', fillOpacity: 0.15, color: '#CA8A04', weight: 1 }} radius={1800} /> {/* Southern Bhavarkuan Zone */}

                {complaints.map((c) => (
                    <Marker
                        key={c.id}
                        position={[c.location.lat, c.location.lng]}
                        icon={icons[c.aiAnalysis.severity_analysis.severity_level as keyof typeof icons] || icons.Low}
                    >
                        <Popup>
                            <div className="p-0 min-w-[220px]">
                                <div className="flex justify-between items-start mb-2 border-b border-slate-100 pb-2">
                                    <span className="text-xs font-mono text-slate-500 font-medium">ID: {c.id}</span>
                                    <Badge variant={
                                        c.aiAnalysis.severity_analysis.severity_level === "Critical" ? "critical" :
                                            c.aiAnalysis.severity_analysis.severity_level === "High" ? "high" :
                                                (c.aiAnalysis.severity_analysis.severity_level === "Medium" || c.aiAnalysis.severity_analysis.severity_level === "Moderate") ? "moderate" : "low"
                                    }>
                                        {c.aiAnalysis.severity_analysis.severity_level}
                                    </Badge>
                                </div>
                                <h4 className="font-semibold text-[#0B3D91] mb-1 leading-tight">{c.aiAnalysis.category_analysis.category}</h4>
                                <p className="text-sm text-slate-600 mb-3 whitespace-normal break-words">{c.aiAnalysis.category_analysis.subcategory}</p>

                                <div className="text-xs text-slate-500 flex justify-between bg-slate-50 p-2 rounded border border-slate-100 mt-2">
                                    <span suppressHydrationWarning>{new Date(c.createdAt).toLocaleDateString()}</span>
                                    <span className="font-semibold">{c.status}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
