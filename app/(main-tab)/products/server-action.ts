'use server';

import { IProduct } from '@/@types';
import db from '@/lib/db';

const pageSize = 1;

export const fetchNextPage = async (page: number) => {
  const product = (await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
    skip: pageSize * page,
    take: pageSize,
  })) as IProduct[];
  return product;
};
