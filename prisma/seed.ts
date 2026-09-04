import { PrismaClient, BookStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial catalogue data...');

  // Development catalogue seed stub. Initial stock is set to 0 pending official inventory allocation.
  // NO admin credentials or default passwords are created.
  const book = await prisma.book.upsert({
    where: { isbn: '978-93-88909-19-8' },
    update: {},
    create: {
      title: 'Little Lambs Christian Activity Book',
      subtitle: 'English Christian Activity Book for Children',
      slug: 'little-lambs-activity-book',
      sku: 'LL-BK-001',
      isbn: '978-93-88909-19-8',
      description:
        'A delightful English Christian activity book featuring Bible stories, prayers, colouring pages, puzzles, games, and Christian activities for children.',
      shortDescription:
        'English Christian Activity Book containing stories, prayers, games, and activities.',
      ageMin: 4,
      ageMax: 10,
      language: 'English',
      publisher: 'Pavanatma Publishers Pvt. Ltd. / Atma Books',
      edition: 'First Edition',
      price: 100.00,
      stock: 0, // Stock set to 0 pending actual business inventory allocation
      reservedStock: 0,
      status: BookStatus.ACTIVE,
      featured: true,
    },
  });

  console.log(`Seeded catalogue item: ${book.title} (ISBN: ${book.isbn}, Stock: ${book.stock})`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
