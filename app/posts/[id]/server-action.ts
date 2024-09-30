import { revalidateTag } from 'next/cache';
import db from '@/lib/db';

export const deleteCommentAction = async (params: {
  commentId: number;
  postId: number;
}) => {
  await db.comment.delete({
    where: {
      id: params.commentId,
    },
  });

  revalidateTag(`POST_${Number(params.postId)}_COMMENT`);
};
