'use server';

import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

export interface InitialState {
  authentication: boolean;
}

const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;

const phoneSchema = z
  .string()
  .trim()
  .refine(val => phoneRegex.test(val), {
    message: '올바른 휴대폰 번호 형식이 아니에요.',
  });

const codeExist = async (value: number) => {
  const exist = await db.verificationCode.findUnique({
    where: {
      code: value.toString(),
    },
    select: {
      id: true,
    },
  });
  return !!exist;
};

const verificationCodeSchema = z.coerce
  .number()
  .superRefine((val, ctx) => {
    if (+val < 100000 || +val > 1000000) {
      ctx.addIssue({
        code: 'custom',
        message: '인증번호 6자를 입력해주세요.',
        fatal: true,
      });
    }
  })
  .refine(val => codeExist(val), { message: '인증번호가 일치하지 않아요.' });

const createCode = () => {
  const code = crypto.randomInt(100000, 999999).toString();
  return code;
};

export const handleVerifyCode = async (
  prevState: InitialState,
  formData: FormData,
) => {
  const data = {
    phoneNumber: formData.get('phone-number'),
    verificationCode: formData.get('verification-code'),
  };

  if (!prevState.authentication) {
    const phoneRes = phoneSchema.safeParse(data.phoneNumber);
    if (!phoneRes.success) {
      return { authentication: false, error: phoneRes.error.flatten() };
    }
    await db.verificationCode.deleteMany({
      where: {
        user: {
          phone: phoneRes.data,
        },
      },
    });
    const code = createCode();
    await db.verificationCode.create({
      data: {
        code,
        user: {
          connectOrCreate: {
            where: { phone: phoneRes.data },
            create: {
              username: crypto.randomBytes(10).toString('hex'),
              phone: phoneRes.data,
            },
          },
        },
      },
    });
    return { authentication: true };
  }

  const verificationCodeRes = await verificationCodeSchema.safeParseAsync(
    data.verificationCode,
  );

  if (!verificationCodeRes.success) {
    return {
      authentication: true,
      error: verificationCodeRes?.error.flatten(),
    };
  }

  const verificationValue = await db.verificationCode.findUnique({
    where: {
      code: verificationCodeRes.data.toString(),
    },
    select: { id: true, userId: true },
  });
  if (verificationValue) {
    const session = await getSession();
    session.id = verificationValue?.userId;
    await session.save();
    await db.verificationCode.delete({
      where: {
        id: verificationValue.id,
      },
    });
  }

  return redirect('/');
};
