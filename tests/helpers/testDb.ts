import { prisma } from '../../src/lib/db/prisma';

export async function setupTestInventory(stockCount = 5) {
  // Upsert official test book record with stock > 0 for E2E testing
  const book = await prisma.book.upsert({
    where: { isbn: '978-93-88909-19-8' },
    update: {
      stock: stockCount,
      reservedStock: 0,
      status: 'ACTIVE',
    },
    create: {
      title: 'Little Lambs',
      subtitle: 'English Christian Activity Book',
      slug: 'little-lambs-christian-activity-book',
      sku: 'LL-BK-001',
      isbn: '978-93-88909-19-8',
      description: 'Activity book description',
      ageMin: 4,
      ageMax: 10,
      language: 'English',
      publisher: 'Pavanatma Publishers Pvt. Ltd. / Atma Books',
      pricePaise: 10000,
      stock: stockCount,
      reservedStock: 0,
      status: 'ACTIVE',
    },
  });

  return book;
}

export async function cleanupTestInventory() {
  // Reset official book stock back to 0 so real database seed remains stock = 0
  await prisma.book.updateMany({
    where: { isbn: '978-93-88909-19-8' },
    data: {
      stock: 0,
      reservedStock: 0,
    },
  });
}
