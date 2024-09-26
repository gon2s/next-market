'use server';

import { productPageSize } from './page';
import { IProduct } from '@/@types';
import db from '@/lib/db';

export const fetchNextPage = async (page: number) => {
  const product = (await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
    skip: productPageSize * page,
    take: productPageSize,
  })) as IProduct[];
  return product;
};
