"use server"

import { db } from "@/lib/db"
import { Complaint, ComplaintStatus } from "@/lib/data/mock-db"
import { revalidatePath } from "next/cache"

const statusMapping: Record<string, ComplaintStatus> = {
    'pending': 'Open',
    'in_progress': 'In Progress',
    'escalated': 'In Progress',
    'resolved': 'Resolved'
}

// Maps AI category names → database department names
// The backend AI classifier uses broader categories (e.g. "Infrastructure")
// but the DB departments have specific names (e.g. "Roads")
const categoryToDepartment: Record<string, string> = {
    // Direct matches (AI category = DB department name)
    'Electricity': 'Electricity',
    'Sanitation': 'Sanitation',

    // AI categories that map to "Roads"
    'Infrastructure': 'Roads',
    'Roads': 'Roads',
    'Transport': 'Roads',

    // AI categories that map to "Water"
    'Water & Drainage': 'Water',
    'Water': 'Water',

    // AI categories that map to "Sanitation"
    'Environment': 'Sanitation',
    'Public Health': 'Sanitation',

    // Fallback-ish
    'Law & Order': 'Roads',
}

function mapCategoryToDepartment(category: string): string {
    return categoryToDepartment[category] || category
}

export async function getComplaints(citizenId?: string): Promise<Complaint[]> {
    try {
        const complaints = await db.complaints.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                complaint_ai_analysis: true,
                departments: true,
                attachments: true,
                complaint_upvotes: true
            }
        })

        return complaints.map((c: any) => {
            const ai = c.complaint_ai_analysis[0]
            const photoUrl = c.attachments?.[0]?.file_url || null
            const aiCategory = ai?.category || c.departments?.name || "Unknown"

            // Constructing the complex nested object from flat-ish DB fields
            return {
                id: c.id.slice(-8).toUpperCase(), // Short visual ID for UI
                citizenId: c.citizen_id,
                description: c.description,
                location: {
                    lat: Number(c.latitude),
                    lng: Number(c.longitude),
                    address: "Mapped Location"
                },
                photoUrl,
                createdAt: c.created_at?.toISOString() || new Date().toISOString(),
                status: statusMapping[c.status] || 'Open',
                departmentName: mapCategoryToDepartment(aiCategory),
                upvoteCount: c.upvote_count || 0,
                hasUpvoted: citizenId ? c.complaint_upvotes?.some((v: any) => v.user_id === citizenId) : false,
                aiAnalysis: ai ? {
                    language_detection: { detected_language: "en", confidence: 0.99 },
                    translation: { was_translated: false, original_text: "", translated_text: "", translation_confidence: 0 },
                    category_analysis: {
                        category: ai.category,
                        subcategory: ai.sub_category || "",
                        category_confidence: 0.9
                    },
                    sentiment_analysis: {
                        sentiment_score: Number(ai.sentiment_score),
                        sentiment_label: Number(ai.sentiment_score) < 0 ? "Negative" : "Neutral"
                    },
                    severity_analysis: {
                        severity_score: ai.risk_score,
                        severity_level: c.priority_level ? c.priority_level.charAt(0).toUpperCase() + c.priority_level.slice(1) : "Low",
                        risk_type: "Platform Migrated",
                        matched_keywords: []
                    },
                    extracted_keywords: ai.extracted_keywords as string[] || [],
                    entities: { location: "Mapped Location", landmark: "" },
                    department_probabilities: [{ department: ai.category, probability: 0.9 }],
                    priority_scoring: {
                        priority_score: ai.escalation_score,
                        risk_tier: c.priority_level ? c.priority_level.charAt(0).toUpperCase() + c.priority_level.slice(1) : "Low",
                        explainability: { components: [], total_before_clamp: ai.escalation_score }
                    },
                    processing_time_ms: 100, // mock fallback
                    // Keep these specific properties on the root object temporarily for backward compatibility in components
                    summary: ai.ai_summary,
                    suggestedAction: ai.suggested_action || undefined,
                    estimatedResolutionHours: c.departments?.sla_hours || 48
                } : {
                    language_detection: { detected_language: "en", confidence: 1 },
                    translation: { was_translated: false, original_text: "", translated_text: "", translation_confidence: 0 },
                    category_analysis: { category: "Unknown", subcategory: "Unknown", category_confidence: 0 },
                    sentiment_analysis: { sentiment_score: 0, sentiment_label: "Unknown" },
                    severity_analysis: { severity_score: 0, severity_level: "Low", risk_type: "Unknown", matched_keywords: [] },
                    extracted_keywords: [],
                    entities: { location: "Unknown", landmark: "" },
                    department_probabilities: [],
                    priority_scoring: { priority_score: 0, risk_tier: "Low", explainability: { components: [], total_before_clamp: 0 } },
                    processing_time_ms: 0,
                    summary: "No AI data",
                    estimatedResolutionHours: 48
                }
            }
        }) as Complaint[]

    } catch (error) {
        console.error("Failed to fetch complaints from DB", error)
        return []
    }
}

export async function logComplaint(data: any, citizenId?: string) {
    try {
        let citizen;

        if (citizenId) {
            citizen = await db.users.findUnique({ where: { id: citizenId } })
        }

        // Fallback to random if unauthenticated (shouldn't happen in normal flow now)
        if (!citizen) {
            citizen = await db.users.findFirst({ where: { role: 'citizen' } })
        }

        let department = await db.departments.findFirst({
            where: { name: { contains: data.aiAnalysis.category_analysis.category, mode: 'insensitive' } }
        })

        if (!department) {
            department = await db.departments.findFirst() // Fallback
        }

        if (!citizen || !department) {
            throw new Error("Missing default users or departments in Seed DB")
        }

        const newComplaint = await db.complaints.create({
            data: {
                citizen_id: citizen.id,
                department_id: department.id,
                title: data.description.substring(0, 50),
                description: data.description,
                latitude: data.location.lat,
                longitude: data.location.lng,
                priority_level: data.aiAnalysis.severity_analysis.severity_level === 'Critical' ? 'critical' : data.aiAnalysis.severity_analysis.severity_level === 'High' ? 'high' : data.aiAnalysis.severity_analysis.severity_level === 'Medium' ? 'medium' : 'low',
                status: 'pending',
                complaint_ai_analysis: {
                    create: {
                        category: data.aiAnalysis.category_analysis.category,
                        sub_category: data.aiAnalysis.category_analysis.subcategory,
                        sentiment_score: data.aiAnalysis.sentiment_analysis.sentiment_score,
                        risk_score: data.aiAnalysis.severity_analysis.severity_score || 50,
                        escalation_score: data.aiAnalysis.priority_scoring.priority_score,
                        extracted_keywords: data.aiAnalysis.extracted_keywords,
                        ai_summary: data.aiAnalysis.summary || "Summary generation offloaded to backend structure.",
                        suggested_action: data.aiAnalysis.suggestedAction || "Action generation offloaded to backend structure."
                    }
                },
                ...(data.photoDataUrl && {
                    attachments: {
                        create: {
                            file_url: data.photoDataUrl,
                            file_type: "image/jpeg",
                            uploaded_by: citizen.id
                        }
                    }
                })
            }
        })

        revalidatePath('/citizen/history')
        revalidatePath('/citizen/dashboard')
        revalidatePath('/department/incoming')

        return { success: true, docketId: newComplaint.id.slice(-8).toUpperCase() }

    } catch (error) {
        console.error("Failed to insert complaint into DB:", error)
        return { success: false, error: "Database error" }
    }
}

export async function resolveComplaint(docketId: string) {
    try {
        const targetId = docketId.toLowerCase()

        // Find the complaint where the UUID ends with this slice
        // Prisma doesn't support endsWith on UUIDs directly in some databases, 
        // so we fetch the list and find it (fine for prototype size)
        const all = await db.complaints.findMany({
            select: { id: true }
        })
        const complaint = all.find(c => c.id.endsWith(targetId))

        if (!complaint) {
            return { success: false, error: "Complaint not found" }
        }

        await db.complaints.update({
            where: { id: complaint.id },
            data: { status: 'resolved' }
        })

        revalidatePath('/department/incoming')
        revalidatePath('/department/resolved')
        revalidatePath('/department/dashboard')
        revalidatePath('/department/analytics')
        revalidatePath('/citizen/history')
        revalidatePath('/citizen/dashboard')

        return { success: true }
    } catch (error) {
        console.error("Failed to resolve complaint:", error)
        return { success: false, error: "Database error" }
    }
}

export async function toggleUpvote(docketId: string, citizenId: string) {
    if (!citizenId) return { success: false, error: "Unauthorized" };
    try {
        const targetId = docketId.toLowerCase();
        const all = await db.complaints.findMany({ select: { id: true, upvote_count: true } });
        const complaint = all.find(c => c.id.endsWith(targetId));

        if (!complaint) return { success: false, error: "Complaint not found" };

        const existingUpvote = await db.complaint_upvotes.findUnique({
            where: {
                complaint_id_user_id: {
                    complaint_id: complaint.id,
                    user_id: citizenId
                }
            }
        });

        if (existingUpvote) {
            // Remove upvote
            await db.complaint_upvotes.delete({
                where: { id: existingUpvote.id }
            });
            await db.complaints.update({
                where: { id: complaint.id },
                data: { upvote_count: { decrement: 1 } }
            });
        } else {
            // Add upvote
            await db.complaint_upvotes.create({
                data: {
                    complaint_id: complaint.id,
                    user_id: citizenId
                }
            });
            await db.complaints.update({
                where: { id: complaint.id },
                data: { upvote_count: { increment: 1 } }
            });
        }

        revalidatePath('/citizen/dashboard');
        revalidatePath('/citizen/history');
        revalidatePath('/department/incoming');

        return { success: true, hasUpvoted: !existingUpvote };
    } catch (error) {
        console.error("Failed to toggle upvote:", error);
        return { success: false, error: "Database error" };
    }
}
