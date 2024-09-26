'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/lib/db';

export const deleteProductAction = async (params: { id: number }) => {
  await db.product.delete({
    where: {
      id: params.id,
    },
  });
  revalidateTag('product-title');
  redirect('/products');
};
