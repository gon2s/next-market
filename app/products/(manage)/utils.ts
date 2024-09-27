import { z } from 'zod';

export interface IUploadedImage {
  result: {
    id: string;
    uploadURL: string;
  };
  success: boolean;
}

export const productSchema = z.object({
  photo: z.string({
    required_error: '사진은 필수에요',
  }),
  title: z.string({ required_error: '제목은 필수에요' }),
  price: z.coerce.number({ required_error: '가격은 필수에요' }),
  description: z.string(),
});
