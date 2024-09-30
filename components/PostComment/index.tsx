'use client';

/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/naming-convention */

import { isEqual } from 'lodash';
import React, { memo, useRef } from 'react';
import { createCommentAction } from './server-action';

interface PostCommentProps {
  postId: number;
}

function PostComment({ postId }: PostCommentProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await createCommentAction(0, formData);
    if (inputRef.current) inputRef.current.value = '';
  };

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
    </div>
  );
}

export default memo(PostComment, (prev, next) =>
  isEqual(prev.postId, next.postId),
);
