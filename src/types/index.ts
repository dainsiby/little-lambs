export interface BookItem {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  sku: string;
  isbn: string;
  description: string;
  shortDescription: string | null;
  ageMin: number;
  ageMax: number;
  language: string;
  publisher: string;
  edition: string | null;
  releaseDate: Date | string | null;
  price: number | string;
  stock: number;
  reservedStock: number;
  status: 'DRAFT' | 'COMING_SOON' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  featured: boolean;
  coverImage?: string;
}

export interface BookSpec {
  label: string;
  value: string;
}
