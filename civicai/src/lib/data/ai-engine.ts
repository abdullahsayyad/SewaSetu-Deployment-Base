export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
export type Department = "Electricity" | "Water" | "Roads" | "Sanitation" | "Public Safety" | "Unassigned";

// Matches the backend `AnalysisResponse` schema
export interface AIAnalysisResult {
    language_detection: {
        detected_language: string;
        confidence: number;
    };
    translation: {
        was_translated: boolean;
        original_text: string;
        translated_text: string;
        translation_confidence: number;
    };
    category_analysis: {
        category: string;
        subcategory: string;
        category_confidence: number;
    };
    sentiment_analysis: {
        sentiment_score: number;
        sentiment_label: string;
    };
    severity_analysis: {
        severity_score: number;
        severity_level: string;
        risk_type: string;
        matched_keywords: string[];
    };
    extracted_keywords: string[];
    entities: {
        location: string;
        landmark: string;
    };
    department_probabilities: {
        department: string;
        probability: number;
    }[];
    priority_scoring: {
        priority_score: number;
        risk_tier: string;
        explainability: {
            components: {
                name: string;
                raw_value: number;
                weight: number;
                weighted_value: number;
            }[];
            total_before_clamp: number;
        };
    };
    processing_time_ms: number;
    // Temporary UI backward compatibility flags until backend fully migrates these
    summary?: string;
    suggestedAction?: string;
    estimatedResolutionHours?: number;
}

export async function analyzeGrievance(text: string): Promise<AIAnalysisResult | null> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
    try {
        const response = await fetch(`${backendUrl}/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ complaint: text }),
        });

        if (!response.ok) {
            console.error("Backend error analyzing grievance");
            return null;
        }

        const data: AIAnalysisResult = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to reach Python backend", error);
        return null;
    }
}
