/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/naming-convention */

'use client';

import { UserIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import Image from 'next/image';
import React, { memo, useCallback, useRef } from 'react';
import { createCommentAction } from './server-action';
import { IComment } from '@/@types';

interface PostCommentProps {
  postId: number;
  commentList: IComment[];
}

function PostComment({ postId, commentList }: PostCommentProps) {
  // eslint-disable-next-line no-console
  console.log('코멘트 랜더링!');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(async (formData: FormData) => {
    try {
      await createCommentAction(0, formData);
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, []);

  return (
    <div className={'flex flex-col gap-4'}>
      <form action={handleSubmit} className={'flex flex-col gap-4'}>
        <textarea
          ref={inputRef}
          className={
            'px-2.5 py-1.5 bg-transparent rounded-md w-full h-36 focus:outline-none ring-2 focus:ring-4 transition duration-300  ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400'
          }
          name={'comment'}
          placeholder={'댓글을 입력해주세요'}
          minLength={1}
          maxLength={500}
        />
        <div className={'flex'}>
          <input name={'postId'} value={postId} hidden readOnly />
          <button
            className={`mr-0 ml-auto gap-2 text-sm border rounded-xl p-2.5 px-8 transition-colors bg-orange-500 text-white border-orange-500`}
            type={'submit'}
          >
            {'등록'}
          </button>
        </div>
      </form>
      <div className={'border-t-[0.5px] py-2 flex flex-col gap-4'}>
        {commentList.map(li => (
          <div key={li.id}>
            <div className="flex items-center gap-2 mb-2">
              {li.user.profile_img ? (
                <Image
                  width={20}
                  height={20}
                  className="size-7 rounded-full"
                  src={li.user.profile_img}
                  alt={li.user.username}
                />
              ) : (
                <UserIcon className="size-7 rounded-full" />
              )}
              <div>
                <span className="text-sm font-semibold">
                  {li.user.username}
                </span>
                <div className="text-xs">
                  <span>{dayjs(li.created_at).format('YYYY.MM.DD HH:mm')}</span>
                </div>
              </div>
            </div>
            <h2 className="text-sm font-semibold">{li.payload}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(
  PostComment,
  (prev, next) =>
    isEqual(prev.postId, next.postId) &&
    isEqual(prev.commentList, next.commentList),
);
