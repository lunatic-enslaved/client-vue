import type { Product } from '@/entities/product/list';

export interface AddedProduct {
  id: number;
  grams: number;
  time: string;
  product: Product;
}

export interface Meal {
  order: number;
  products: AddedProduct[];
  time: Readonly<string>;
  calories: Readonly<number>;
  carbs: Readonly<number>;
  proteins: Readonly<number>;
  fats: Readonly<number>;
}

export interface AddedProductForMeal {
  id: AddedProduct['id'];
  grams: AddedProduct['grams'];
  time: AddedProduct['time'];
  product: Product;
}
