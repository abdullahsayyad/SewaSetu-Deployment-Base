const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const sunita = await prisma.users.findFirst({
            where: {
                full_name: {
                    contains: 'Sunita',
                    mode: 'insensitive'
                }
            },
            include: {
                departments: true
            }
        });

        if (sunita) {
            console.log("Found User:");
            console.log(JSON.stringify(sunita, null, 2));
        } else {
            console.log("User 'Sunita' not found in the database.");
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
