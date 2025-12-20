import prisma from './src/config/database.js';
import fs from 'fs';

const checkUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                email: true,
                name: true,
                role: true,
            }
        });

        let output = '\n========================================\n';
        output += 'USERS IN DATABASE\n';
        output += '========================================\n';
        output += `Total users: ${users.length}\n\n`;

        if (users.length > 0) {
            users.forEach((user, index) => {
                output += `${index + 1}. Email: ${user.email}\n`;
                output += `   Name: ${user.name}\n`;
                output += `   Role: ${user.role}\n\n`;
            });
            output += 'Use any of these emails to login!\n';
            output += 'Note: You need to know the password you used when registering.\n';
        } else {
            output += '❌ No users found.\n';
            output += 'You need to register a new account first.\n';
        }
        output += '========================================\n';

        console.log(output);
        fs.writeFileSync('users-list.txt', output);
        console.log('\n✅ User list saved to users-list.txt\n');

        await prisma.$disconnect();
    } catch (error) {
        console.error('Error:', error.message);
        await prisma.$disconnect();
    }
};

checkUsers();
