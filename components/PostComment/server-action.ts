'use server';

import { revalidateTag } from 'next/cache';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

export const createCommentAction = async (_: unknown, formData: FormData) => {
  const session = await getSession();
  const data = {
    comment: formData.get('comment'),
    postId: formData.get('postId'),
  };

  await db.comment.create({
    data: {
      userId: session.id!,
      postId: Number(data.postId),
      payload: data.comment as string,
    },
  });

  revalidateTag(`POST_${Number(data.postId)}_COMMENT`);
};
