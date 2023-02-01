import type { Product } from '@/entities/product/list';

export type { Product };

export interface AddedProduct {
  id: number;
  grams: number;
  time: string;
  product: Product;
}

export interface AddEventPayload {
  product: Product;
  grams: number;
  time: Date;
}

export interface EditEventPayload {
  grams: number;
  time: Date;
}
