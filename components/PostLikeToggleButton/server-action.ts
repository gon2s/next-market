'use server';

import { revalidateTag } from 'next/cache';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

export const likePostAction = async (params: { postId: number }) => {
  const session = await getSession();
  await db.like.create({
    data: {
      postId: params.postId,
      userId: session.id!,
    },
  });
  revalidateTag(`LIKE_INFO-${params.postId}`);
};

export const disLikePostAction = async (params: { postId: number }) => {
  const session = await getSession();
  await db.like.delete({
    where: {
      id: {
        postId: params.postId,
        userId: session.id!,
      },
    },
  });
  revalidateTag(`LIKE_INFO-${params.postId}`);
};
