import type { AddedProduct, Meal } from './types';

export function calculateTotalWeightOfNutrient(
  productNutrient: number,
  grams: number
) {
  return (productNutrient / 100) * grams;
}

export function createMeal(order: number, products: AddedProduct[] = []) {
  const meal: Meal = {
    order,
    products,
    get time() {
      return this.products[0]?.time;
    },
    get calories() {
      return this.products.reduce(
        (acc, p) =>
          acc + calculateTotalWeightOfNutrient(p.product.calories, p.grams),
        0
      );
    },
    get carbs() {
      return this.products.reduce(
        (acc, p) =>
          acc + calculateTotalWeightOfNutrient(p.product.carbs, p.grams),
        0
      );
    },
    get proteins() {
      return this.products.reduce(
        (acc, p) =>
          acc + calculateTotalWeightOfNutrient(p.product.proteins, p.grams),
        0
      );
    },
    get fats() {
      return this.products.reduce(
        (acc, p) =>
          acc + calculateTotalWeightOfNutrient(p.product.fats, p.grams),
        0
      );
    }
  };

  return meal;
}
