'use server';

import { redirect } from 'next/navigation';
import { productSchema } from '../../utils';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

export const fetchProductDetail = async (params: { id: number }) => {
  const productDetail = await db.product.findUnique({
    where: { id: params.id },
  });

  return productDetail;
};

export const updateProductAction = async (_: unknown, formData: FormData) => {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
    id: formData.get('id'),
  };

  const res = await productSchema.safeParseAsync(data);
  if (!res.success) {
    return res.error.flatten();
  }

  const session = await getSession();
  if (session.id) {
    const product = await db.product.update({
      where: {
        id: Number(data.id),
      },
      data: {
        title: res.data.title,
        description: res.data.description,
        price: res.data.price,
        photo: res.data.photo,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/products/${product.id}`);
  }
  return null;
};
