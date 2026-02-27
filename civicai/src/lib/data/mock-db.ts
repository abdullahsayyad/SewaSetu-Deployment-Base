import { AIAnalysisResult, Department } from "./ai-engine";

export type ComplaintStatus = "Open" | "In Progress" | "Resolved";

export interface Complaint {
    id: string;
    citizenId: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    photoUrl?: string | null;
    createdAt: string;
    status: ComplaintStatus;
    departmentName: string; // Mapped department name (e.g., "Roads", "Electricity")
    aiAnalysis: AIAnalysisResult;
    resolutionNotes?: string;
    resolvedAt?: string;
    upvoteCount: number;
    hasUpvoted: boolean;
}

// Coordinate center for simulation (Indore, Madhya Pradesh)
export const CITY_CENTER = { lat: 22.7196, lng: 75.8577 };

export const MOCK_NOTIFICATIONS = [
    { id: 1, title: "Critical Alert", message: "Live wire reported at Central Park West", time: "30m ago", read: false, type: "critical" },
    { id: 2, title: "SLA Warning", message: "Complaint C-1102C approaching SLA breach", time: "2h ago", read: false, type: "warning" },
];
