/* eslint-disable @typescript-eslint/no-misused-promises */
import { UserIcon, XMarkIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import Image from 'next/image';
import React from 'react';
import { deleteCommentAction } from './server-action';
import { IComment } from '@/@types';
import getSession from '@/lib/getSession';

interface PostCommentItemProps {
  postId: number;
  data: IComment;
}

async function PostCommentItem({ postId, data }: PostCommentItemProps) {
  const session = await getSession();

  const handleDeleteComment = async () => {
    'use server';

    await deleteCommentAction({ commentId: data.id, postId });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 ">
        {data.user.profile_img ? (
          <Image
            width={20}
            height={20}
            className="size-7 rounded-full"
            src={data.user.profile_img}
            alt={data.user.username}
          />
        ) : (
          <UserIcon className="size-7 rounded-full" />
        )}
        <div className={'flex-1 '}>
          <span className="text-sm font-semibold">{data.user.username}</span>
          <div className="text-xs">
            <span>{dayjs(data.created_at).format('YYYY.MM.DD HH:mm')}</span>
          </div>
        </div>
        {session.id === data.user.id && (
          <form action={handleDeleteComment}>
            <button type={'submit'}>
              <XMarkIcon className="size-4 rounded-full" />
            </button>
          </form>
        )}
      </div>
      <h2 className="text-sm font-semibold">{data.payload}</h2>
    </div>
  );
}

export default PostCommentItem;
