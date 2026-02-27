import { PortalWrapper } from "@/components/shared/portal-wrapper"

export default function CitizenLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <PortalWrapper
            userType="citizen"
            userName="Aadhaar Linked User"
            userRole="Citizen Session Active"
        >
            {children}
        </PortalWrapper>
    )
}
