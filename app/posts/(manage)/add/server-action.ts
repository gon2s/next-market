'use server';

import { redirect } from 'next/navigation';
import { postSchema } from '../utils';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

export const createPostAction = async (_: unknown, formData: FormData) => {
  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
  };

  const res = await postSchema.safeParseAsync(data);
  if (!res.success) {
    return res.error.flatten();
  }

  const session = await getSession();
  if (session.id) {
    const product = await db.post.create({
      data: {
        title: res.data.title,
        description: res.data.description,
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
    redirect(`/posts/${product.id}`);
  }
  return null;
};
