import { prisma } from '@/lib/db/prisma';
import { addressSchema, AddressInput } from '@/lib/validation/address';

export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function createAddress(userId: string, input: AddressInput) {
  const validated = addressSchema.parse(input);

  // If this is user's first address, force it to be default
  const existingCount = await prisma.address.count({ where: { userId } });
  const shouldBeDefault = existingCount === 0 || validated.isDefault;

  if (shouldBeDefault) {
    // Reset any previous default addresses for this user
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      fullName: validated.fullName,
      phone: validated.phone,
      addressLine1: validated.addressLine1,
      addressLine2: validated.addressLine2 || null,
      city: validated.city,
      district: validated.district || null,
      state: validated.state,
      postalCode: validated.postalCode,
      landmark: validated.landmark || null,
      country: validated.country || 'India',
      isDefault: shouldBeDefault,
    },
  });
}

export async function updateAddress(userId: string, addressId: string, input: Partial<AddressInput>) {
  // Check ownership
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!existing) {
    throw new Error('Address not found or unauthorized access.');
  }

  const merged = {
    fullName: input.fullName ?? existing.fullName,
    phone: input.phone ?? existing.phone,
    addressLine1: input.addressLine1 ?? existing.addressLine1,
    addressLine2: input.addressLine2 ?? existing.addressLine2 ?? '',
    city: input.city ?? existing.city,
    district: input.district ?? existing.district ?? '',
    state: input.state ?? existing.state,
    postalCode: input.postalCode ?? existing.postalCode,
    landmark: input.landmark ?? existing.landmark ?? '',
    country: input.country ?? existing.country,
    isDefault: input.isDefault ?? existing.isDefault,
  };

  const validated = addressSchema.parse(merged);

  if (validated.isDefault && !existing.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: addressId },
    data: {
      fullName: validated.fullName,
      phone: validated.phone,
      addressLine1: validated.addressLine1,
      addressLine2: validated.addressLine2 || null,
      city: validated.city,
      district: validated.district || null,
      state: validated.state,
      postalCode: validated.postalCode,
      landmark: validated.landmark || null,
      country: validated.country || 'India',
      isDefault: validated.isDefault,
    },
  });
}

export async function deleteAddress(userId: string, addressId: string) {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!existing) {
    throw new Error('Address not found or unauthorized access.');
  }

  await prisma.address.delete({
    where: { id: addressId },
  });

  // If deleted address was default, set the latest remaining address as default
  if (existing.isDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (nextAddress) {
      await prisma.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true },
      });
    }
  }

  return { success: true };
}

export async function setDefaultAddress(userId: string, addressId: string) {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!existing) {
    throw new Error('Address not found or unauthorized access.');
  }

  await prisma.address.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });

  return prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });
}
