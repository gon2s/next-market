'use server';

import { z } from 'zod';

const formSchema = z.object({
  email: z.string().trim().email({ message: '이메일 형식으로 입력해 주세요.' }),
  password: z
    .string()
    .trim()
    .refine(val => val.length >= 10 && val.length <= 20, {
      message: '비밀번호는 10자 이상 20자 이하로 입력해주세요.',
    }),
});

export const handleLogin = (
  _: unknown,
  formData: FormData,
  // eslint-disable-next-line consistent-return
) => {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const res = formSchema.safeParse(data);
  if (!res.success) {
    return res.error.flatten();
  }
};
