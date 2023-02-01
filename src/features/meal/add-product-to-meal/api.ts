import gql from 'graphql-tag';
import { useMutation } from '@vue/apollo-composable';

import type { AddedProduct, Product } from './types';

const RETURNED_FRAGMENT = gql`
  fragment AddedProduct on AddedProduct {
    id
    grams
    time
    product {
      id
      name
    }
  }
`;

export function useAddProduct(props: {
  getVariables: () => {
    date: Date;
    productId: Product['id'];
    time: Date;
    grams: number;
  };
  onSuccess: (addedProduct: AddedProduct) => void;
  onError: () => void;
}) {
  const result = useMutation<{ CREATE_ADDED_PRODUCT: AddedProduct }>(
    gql`
      ${RETURNED_FRAGMENT}
      mutation CREATE_ADDED_PRODUCT($data: AddedProductCreateInput!) {
        CREATE_ADDED_PRODUCT: createOneAddedProduct(data: $data) {
          ...RETURNED_FRAGMENT
        }
      }
    `,
    () => {
      const variables = props.getVariables();

      return {
        variables: {
          data: {
            time: variables.time,
            grams: variables.grams,
            product: { connect: { id: variables.productId } },
            day: {
              connectOrCreate: {
                where: { date: variables.date },
                create: { date: variables.date }
              }
            }
          }
        }
      };
    }
  );

  result.onDone(
    (r) =>
      r.data?.CREATE_ADDED_PRODUCT &&
      props.onSuccess(r.data?.CREATE_ADDED_PRODUCT)
  );
  result.onError(props.onError);

  return result;
}

export function useEditProduct(props: {
  getVariables: () => {
    addedProductId: number;
    time: Date;
    grams: number;
  };
  onSuccess: (addedProduct: AddedProduct) => void;
  onError: () => void;
}) {
  const result = useMutation<{ UPDATE_ADDED_PRODUCT: AddedProduct }>(
    gql`
      ${RETURNED_FRAGMENT}
      mutation UPDATE_ADDED_PRODUCT(
        $addedProductId: Int!
        $data: AddedProductUpdateInput!
      ) {
        UPDATE_ADDED_PRODUCT: createOneAddedProduct(
          where: { id: $addedProductId }
          data: $data
        ) {
          ...RETURNED_FRAGMENT
        }
      }
    `,
    () => {
      const variables = props.getVariables();

      return {
        variables: {
          data: {
            time: { set: variables.time },
            grams: { set: variables.grams }
          }
        }
      };
    }
  );

  result.onDone(
    (r) =>
      r.data?.UPDATE_ADDED_PRODUCT &&
      props.onSuccess(r.data?.UPDATE_ADDED_PRODUCT)
  );
  result.onError(props.onError);

  return result;
}
