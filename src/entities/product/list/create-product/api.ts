import gql from 'graphql-tag';
import { useMutation } from '@vue/apollo-composable';
import type { Product } from '@/entities/product/list';

export function useCreateProduct(
  getVariables: () => {
    name: string;
    calories: number;
    carbs: number;
    fats: number;
    proteins: number;
  },
  onSuccess: (product: Product) => void,
  onError: () => void
) {
  const result = useMutation<{ CREATE_PRODUCT: Product }>(
    gql`
      mutation CREATE_PRODUCT($data: ProductCreateInput!) {
        CREATE_PRODUCT: createOneProduct(data: $data) {
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
      const variables = getVariables();

      return {
        variables: {
          data: {
            name: variables.name,
            proteins: variables.proteins,
            calories: variables.calories,
            carbs: variables.carbs,
            fats: variables.fats
          }
        }
      };
    }
  );

  result.onDone(
    (response) =>
      response.data?.CREATE_PRODUCT && onSuccess(response.data?.CREATE_PRODUCT)
  );
  result.onError(onError);

  return result;
}

export function useUpdateProduct(
  getVariables: () => {
    id: number;
    name: string;
    calories: number;
    carbs: number;
    fats: number;
    proteins: number;
  },
  onSuccess: (product: Product) => void,
  onError: () => void
) {
  const result = useMutation<{ UPDATE_PRODUCT: Product }>(
    gql`
      mutation UPDATE_PRODUCT($productId: Int!, $data: ProductUpdateInput!) {
        UPDATE_PRODUCT: updateOneProduct(
          where: { id: $productId }
          data: $data
        ) {
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
      const variables = getVariables();

      return {
        variables: {
          productId: variables.id,
          data: {
            name: { set: variables.name },
            proteins: { set: variables.proteins },
            calories: { set: variables.calories },
            carbs: { set: variables.carbs },
            fats: { set: variables.fats }
          }
        }
      };
    }
  );

  result.onDone(
    (response) =>
      response.data?.UPDATE_PRODUCT && onSuccess(response.data?.UPDATE_PRODUCT)
  );
  result.onError(onError);

  return result;
}
