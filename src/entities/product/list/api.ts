import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';

export interface Product {
  id: number;
  name: string;
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
}

export function useProducts(getVariables: () => { name: string | null }) {
  const result = useQuery<{ PRODUCTS: Product[] }>(
    gql`
      query GET_PRODUCTS($where: ProductWhereInput) {
        PRODUCTS: products(where: $where, orderBy: { name: asc }) {
          id
          name
          proteins
          calories
          carbs
          fats
        }
      }
    `,
    () => {
      const { name } = getVariables();
      return name
        ? { where: { name: { contains: name, mode: 'insensitive' } } }
        : null;
    },
    { debounce: 100 }
  );

  return result;
}
