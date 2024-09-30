import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
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

export const deletePostAction = async (params: { postId: number }) => {
  await db.post.delete({
    where: {
      id: params.postId,
    },
  });

  redirect('/posts');
};
