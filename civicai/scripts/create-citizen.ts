import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const newCitizen = await prisma.users.create({
        data: {
            email: 'citizen-test@india.gov.in',
            phone: '9998887776',
            password_hash: '123456',
            full_name: 'Amit Verma',
            role: 'citizen',
        }
    })
    console.log('Successfully created test citizen:', newCitizen.email, '| Phone:', newCitizen.phone)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
