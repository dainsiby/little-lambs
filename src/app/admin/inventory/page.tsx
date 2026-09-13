import React from 'react';
import { getAdminInventoryOverview, getRecentStockMovements } from '@/lib/admin/adminInventoryService';
import { InventoryClient } from './InventoryClient';

export default async function AdminInventoryPage() {
  const books = await getAdminInventoryOverview();
  const movements = await getRecentStockMovements(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
          Inventory & Stock Movements
        </h1>
        <p className="text-xs text-brand-slate">
          Inspect physical stock, track reserved quantities, and perform transactional stock adjustments with audit logging.
        </p>
      </div>

      <InventoryClient books={books} movements={movements} />
    </div>
  );
}
