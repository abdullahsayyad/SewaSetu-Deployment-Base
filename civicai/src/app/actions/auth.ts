"use server"

import { db } from "@/lib/db"

export async function loginCitizen(identifier: string, code: string) {
    try {
        const user = await db.users.findFirst({
            where: {
                role: 'citizen',
                OR: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        })

        if (!user || user.password_hash !== code) {
            return { success: false, error: "Invalid Mobile/Aadhaar number or OTP." }
        }

        return { success: true, userId: user.id }
    } catch (e) {
        console.error("Login Error:", e)
        return { success: false, error: "Authentication service unavailable." }
    }
}

export async function loginOfficer(departmentName: string, email: string, code: string) {
    try {
        const user = await db.users.findFirst({
            where: {
                role: 'officer',
                email: email
            },
            include: {
                departments: true
            }
        })

        if (!user || user.password_hash !== code) {
            return { success: false, error: "Invalid Officer ID or Secure Password." }
        }

        const deptNameMatch = user.departments?.name.includes(departmentName.split(' ')[0])
        if (!deptNameMatch) {
            return { success: false, error: "Officer is not registered under the selected department." }
        }

        return { success: true, department: departmentName }
    } catch (e) {
        console.error("Login Error:", e)
        return { success: false, error: "Authentication service unavailable." }
    }
}
