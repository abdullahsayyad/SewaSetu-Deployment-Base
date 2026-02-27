const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const data = await prisma.complaints.findMany({ include: { complaint_ai_analysis: true, departments: true, attachments: true } });
    console.log(JSON.stringify(data, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
