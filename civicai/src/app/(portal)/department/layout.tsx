import { PortalWrapper } from "@/components/shared/portal-wrapper"

export default function DepartmentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <PortalWrapper
            userType="department"
            userName="Officer N. Sharma"
            userRole="Nodal Officer — Selected Dept."
        >
            {children}
        </PortalWrapper>
    )
}
