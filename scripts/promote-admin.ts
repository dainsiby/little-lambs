import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  let emailArg = args.find((arg) => arg.startsWith('--email='));

  if (!emailArg) {
    console.error('Error: Please provide user email. Usage: npm run admin:promote -- --email=user@example.com');
    process.exit(1);
  }

  const email = emailArg.split('=')[1]?.toLowerCase().trim();

  if (!email) {
    console.error('Error: Invalid email argument.');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`Error: User with email "${email}" not found.`);
    process.exit(1);
  }

  if (user.role === Role.ADMIN) {
    console.log(`User "${email}" is already an ADMIN.`);
    process.exit(0);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { role: Role.ADMIN },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: 'ADMIN_PROMOTED_VIA_CLI',
      entityType: 'User',
      entityId: user.id,
      payload: { email, promotedAt: new Date().toISOString() },
    },
  });

  console.log(`Successfully promoted user "${updatedUser.email}" (${updatedUser.id}) to Role.ADMIN.`);
}

main()
  .catch((e) => {
    console.error('Error promoting admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
