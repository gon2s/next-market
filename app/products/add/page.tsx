'use client';

import { PhotoIcon } from '@heroicons/react/24/solid';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { useFormState } from 'react-dom';
import { uploadProductAction, uploadUrlAction } from './server-action';
import { Button, Input } from '@/components';

function ProductAddPage() {
  const [preview, setPreview] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadImageId, setUploadImageId] = useState('');

  const handleImageChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { files },
      } = e;
      if (!files) return;
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      const { success, result } = await uploadUrlAction();
      if (success) {
        setUploadUrl(result.uploadURL);
        setUploadImageId(result.id);
      }
    },
    [],
  );

  const interceptAction = useCallback(
    async (_: unknown, formData: FormData) => {
      const photoFile = formData.get('photo');
      if (!photoFile) return;

      const form = new FormData();
      form.append('file', photoFile);

      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: form,
      });

      if (res.status !== 200) {
        return;
      }

      const photoUrl = `https://imagedelivery.net/6IREz8AMoHUB6_OB5KvL4w/${uploadImageId}`;
      formData.set('photo', photoUrl);
      // eslint-disable-next-line consistent-return
      return uploadProductAction(_, formData);
    },
    [uploadUrl, uploadImageId],
  );

  const [state, action] = useFormState(interceptAction, null);

  return (
    <div>
      <form action={action} className={'p-5 flex flex-col gap-5'}>
        <label
          htmlFor={'photo'}
          className={
            'border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover'
          }
          style={{ backgroundImage: `url(${preview})` }}
        >
          {!preview && (
            <>
              <PhotoIcon className={'w-20'} />
              <div className={'text-neutral-400 text-sm'}>
                {'사진을 추가해주세요.'}
                {state?.fieldErrors.photo}
              </div>
            </>
          )}
        </label>
        <input
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onChange={handleImageChange}
          accept={'image/jpg,image/png,image/jpeg,image/gif'}
          type={'file'}
          id={'photo'}
          name={'photo'}
          className={'hidden'}
        />
        <Input
          required
          name={'title'}
          placeholder={'제목'}
          type={'text'}
          errors={state?.fieldErrors.title}
        />
        <Input
          name={'price'}
          type={'number'}
          required
          placeholder={'가격'}
          errors={state?.fieldErrors.price}
        />
        <Input
          required
          name={'description'}
          type={'text'}
          placeholder={'자세한 설명'}
        />
        <Button>{'작성 완료'}</Button>
      </form>
    </div>
  );
}

export default ProductAddPage;
