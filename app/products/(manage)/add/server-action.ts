'use server';

import { redirect } from 'next/navigation';
import { productSchema } from '../utils';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

export const createProductAction = async (_: unknown, formData: FormData) => {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  const res = await productSchema.safeParseAsync(data);
  if (!res.success) {
    return res.error.flatten();
  }

  const session = await getSession();
  if (session.id) {
    const product = await db.product.create({
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
