const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.users.findMany({ include: { departments: true } });

    console.log('--- Current User Credentials ---');
    for (const u of users) {
        console.log(`Role: ${u.role.toUpperCase()} | Name: ${u.full_name} | Phone: ${u.phone} | Email: ${u.email} ${u.departments ? '| Dept: ' + u.departments.name : ''}`);
    }

    console.log('\n--- Adding New Citizen ---');
    const newCitizen = await prisma.users.create({
        data: {
            full_name: 'Rahul Kumar',
            email: 'rahul.citizen1@example.com',
            password_hash: 'hashed_pwd_example',
            role: 'citizen',
            phone: '9876543220'
        }
    });
    console.log(`Successfully added citizen: ${newCitizen.full_name} | Phone: ${newCitizen.phone} | Email: ${newCitizen.email}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
