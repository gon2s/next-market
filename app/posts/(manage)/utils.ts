import { z } from 'zod';

export const postSchema = z.object({
  title: z.string({ required_error: '제목을 입력해주세요' }),
  description: z.string({ required_error: '내용을 입력해주세요' }),
});
