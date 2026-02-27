const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Initiating complaint wipe...");

    try {
        const deleted = await prisma.complaints.deleteMany({});
        console.log(`Successfully deleted ${deleted.count} complaints and all cascading associated data (AI analysis, attachments, history, etc.).`);
    } catch (err) {
        console.error("Failed to delete complaints:", err);
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
