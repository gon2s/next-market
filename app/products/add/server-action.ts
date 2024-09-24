'use server';

import db from '@/lib/db';
import getSession from '@/lib/getSession';
import fs from 'fs/promises';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export interface IUploadedImage {
  result: {
    id: string;
    uploadURL: string;
  };
  success: boolean;
}

const productSchema = z.object({
  photo: z.string({
    required_error: '사진은 필수에요',
  }),
  title: z.string({ required_error: '제목은 필수에요' }),
  price: z.coerce.number({ required_error: '가격은 필수에요' }),
  description: z.string(),
});

/**
 * 요청 시 Cloudflare로부터 일회성 이미지 업로드 URL을 생성하는 함수.
 *
 * 이 함수는 Cloudflare API를 호출하여 단 한 번만 사용할 수 있는 일회성 업로드 URL을 반환합니다.
 */
export const uploadUrlAction = async (): Promise<IUploadedImage> => {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}` },
    },
  );
  const data = await res.json();
  return data;
};

export const uploadProductAction = async (_: unknown, formData: FormData) => {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  const res = await productSchema.safeParseAsync(data);
  if (!res.success) {
    return res.error.flatten();
  }

  const session = await getSession();
  if (session.id) {
    const product = await db.product.create({
      data: {
        title: res.data.title,
        description: res.data.description,
        price: res.data.price,
        photo: res.data.photo,
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
    redirect(`/products/${product.id}`);
  }
};
