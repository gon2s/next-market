'use client';

import React from 'react';
import { useFormState } from 'react-dom';
import { createPostAction } from './server-action';
import { Input } from '@/components';

function AddPostPage() {
  const [state, action] = useFormState(createPostAction, null);

  return (
    <div>
      <form action={action} className={'p-5 flex flex-col gap-4'}>
        <Input
          required
          name={'title'}
          placeholder={'제목'}
          type={'text'}
          errors={state?.fieldErrors.title}
        />
        <div>
          <textarea
            required
            className={
              'px-2.5 py-2 bg-transparent rounded-md w-full h-36 focus:outline-none ring-2 focus:ring-4 transition duration-300  ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400'
            }
            name={'description'}
            placeholder={'내용을 입력해주세요'}
            minLength={1}
            maxLength={500}
          />
          {state?.fieldErrors.description?.map(err => (
            <span key={err} className={'text-red-500'}>
              {err}
            </span>
          ))}
        </div>
        <div className={'flex'}>
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

export default AddPostPage;
