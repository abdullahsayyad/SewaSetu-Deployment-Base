const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Database Summary Report\n=======================");

    try {
        const citizenCount = await prisma.users.count({ where: { role: 'citizen' } });
        const officerCount = await prisma.users.count({ where: { role: 'officer' } });
        const deptCount = await prisma.departments.count();
        const complaintCount = await prisma.complaints.count();
        const resolvedCount = await prisma.complaints.count({ where: { status: 'resolved' } });
        const aiCount = await prisma.complaint_ai_analysis.count();

        console.log(`Overview:`);
        console.log(`- Citizens: ${citizenCount}`);
        console.log(`- Officers: ${officerCount}`);
        console.log(`- Departments: ${deptCount}`);
        console.log(`- Total Complaints: ${complaintCount}`);
        console.log(`  - Resolved: ${resolvedCount}`);
        console.log(`  - With AI Analysis: ${aiCount}`);

        const depts = await prisma.departments.findMany();
        console.log("\nComplaints by Department:");
        for (const d of depts) {
            const dCount = await prisma.complaints.count({ where: { department_id: d.id } });
            console.log(`  - ${d.name}: ${dCount} complaints`);
        }

        const latest = await prisma.complaints.findMany({
            take: 3,
            orderBy: { created_at: 'desc' },
            include: { complaint_ai_analysis: true }
        });

        console.log(`\nRecent Complaints (Last ${latest.length}):`);
        for (const c of latest) {
            const desc = c.description ? c.description.substring(0, 50) : "No description";
            console.log(`  - [${c.status}] ${desc}... `);
            if (c.complaint_ai_analysis && c.complaint_ai_analysis.length > 0) {
                console.log(`      -> AI Category: ${c.complaint_ai_analysis[0].category} | Risk Score: ${c.complaint_ai_analysis[0].risk_score}`);
            } else {
                console.log(`      -> AI Analysis: Pending`);
            }
        }
    } catch (err) {
        console.error("Error querying database:", err.message);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
