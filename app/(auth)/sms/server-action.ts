'use server';

import { redirect } from 'next/navigation';
import validator from 'validator';
import { z } from 'zod';

export interface InitialState {
  authentication: boolean;
}

const phoneSchema = z
  .string()
  .trim()
  .refine(val => validator.isMobilePhone(val, 'ko-KR'), {
    message: '올바른 휴대폰 번호 형식이 아니에요.',
  });

const verificationCodeSchema = z.coerce
  .number()
  .refine(val => val > 99999 && val < 1000000, {
    message: '인증번호 6자를 입력해주세요.',
  });

export const handleVerifyCode = (
  prevState: InitialState,
  formData: FormData,
  // eslint-disable-next-line consistent-return
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
    return { authentication: true };
  }

  const verificationCodeRes = verificationCodeSchema.safeParse(
    data.verificationCode,
  );
  if (!verificationCodeRes.success) {
    return { authentication: true, error: verificationCodeRes.error.flatten() };
  }
  redirect('/');
};
