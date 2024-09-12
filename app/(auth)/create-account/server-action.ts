'use server';

import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

const passwordReg =
  /^(?=.*[A-Za-z])(?=.*\d|.*[!@#$%^&*()_+{}[\]:;"'<>?,./])|(?=.*\d)(?=.*[A-Za-z]|.*[!@#$%^&*()_+{}[\]:;"'<>?,./])|(?=.*[!@#$%^&*()_+{}[\]:;"'<>?,./])(?=.*[A-Za-z]|.*\d).+$/;

const handleCheckUserName = async (val: string) => {
  const user = await db.user.findUnique({
    where: { username: val },
    select: { id: true },
  });
  return !user;
};

const handleCheckUserEmail = async (val: string) => {
  const user = await db.user.findUnique({
    where: { email: val },
    select: { id: true },
  });
  return !user;
};

const formSchema = z
  .object({
    name: z
      .string()
      .refine(val => val.length >= 3 && val.length <= 10, {
        message: '이름은 3자 이상 10자 이하로 입력해주세요',
      })
      .refine(val => handleCheckUserName(val), {
        message: '이미 존재하는 이름이에요',
      }),
    email: z
      .string()
      .trim()
      .email({ message: '이메일 형식으로 입력해 주세요' })
      .refine(val => handleCheckUserEmail(val), {
        message: '이미 존재하는 이메일이에요',
      }),
    password: z
      .string()
      .trim()
      .regex(passwordReg, {
        message:
          '비밀번호는 대소문자, 숫자, 특수문자 중 두 개 이상의 조합으로 이루어져야 해요',
      })
      .refine(val => val.length >= 10 && val.length <= 20, {
        message: '비밀번호는 10자 이상 20자 이하로 입력해주세요',
      }),
    confirmPassword: z.string().trim(),
  })
  .refine(
    data => data.password.length > 0 && data.password === data.confirmPassword,
    { message: '비밀번호가 일치하지 않아요', path: ['confirmPassword'] },
  );

export const handleCreateAccount = async (
  _: unknown,
  formData: FormData,
  // eslint-disable-next-line consistent-return
) => {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const res = await formSchema.safeParseAsync(data);
  if (!res.success) {
    return res.error.flatten();
  }

  const hashedPassword = await bcrypt.hash(res.data.password, 12);

  const user = await db.user.create({
    data: {
      username: res.data.name,
      email: res.data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  const session = await getSession();
  session.id = user.id;
  await session.save();

  redirect('/profile');
};
