'use server';

import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

const handleCheckUserEmailValid = async (val: string) => {
  const user = await db.user.findUnique({
    where: { email: val },
  });
  return !user;
};

const formSchema = z.object({
  email: z.string().trim().email({ message: '이메일 형식으로 입력해 주세요' }),
  password: z
    .string()
    .trim()
    .refine(val => val.length >= 10 && val.length <= 20, {
      message: '비밀번호는 10자 이상 20자 이하로 입력해주세요',
    })
    .refine(val => handleCheckUserEmailValid(val), {
      message: '해당 이메일을 가진 유저가 존재하지 않아요',
    }),
});

export const handleLogin = async (_: unknown, formData: FormData) => {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const res = await formSchema.safeParseAsync(data);
  if (!res.success) {
    return res.error.flatten();
  }

  const user = await db.user.findUnique({
    where: { email: res.data.email },
    select: { id: true, password: true },
  });
  if (user?.password) {
    const isSuccess = await bcrypt.compare(res.data.password, user?.password);
    if (isSuccess) {
      const session = await getSession();
      session.id = user.id;
      await session.save();
      redirect('/profile');
    }
  }
  return {
    fieldErrors: {
      email: [''],
      password: ['비밀번호가 일치하지 않아요'],
    },
  };
};
