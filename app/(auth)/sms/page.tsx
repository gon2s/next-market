'use client';

import { redirect } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { handleVerifyCode } from './server-action';
import { Button, Input } from '@/components';

const formStats = {
  authentication: false,
  error: undefined,
};

function SMSPage() {
  const numberRef = useRef<HTMLInputElement>(null);

  const [state, action] = useFormState(handleVerifyCode, formStats);

  useEffect(() => {
    if (state.authentication) {
      if (numberRef.current) numberRef.current.value = '';
    }
  }, [state.authentication]);

  useEffect(() => {
    redirect('/login');
  }, []);

  return (
    <div className={'flex flex-col gap-10 py-8 px-6'}>
      <div className={'flex flex-col gap-2 *:font-medium'}>
        <h1 className={'text-2xl'}>SMS 로그인</h1>
        <h2>휴대폰 번호로 로그인하기</h2>
      </div>
      <form className={'flex flex-col gap-3'} action={action}>
        {state.authentication ? (
          <Input
            ref={numberRef}
            name={'verification-code'}
            type={'number'}
            placeholder={'인증 번호'}
            required
            maxLength={6}
            errors={state?.error?.formErrors}
            onInput={e => {
              if (e.currentTarget.value.length > e.currentTarget.maxLength) {
                e.currentTarget.value = e.currentTarget.value.slice(
                  0,
                  e.currentTarget.maxLength,
                );
              }
            }}
          />
        ) : (
          <Input
            name={'phone-number'}
            type={'string'}
            placeholder={'휴대폰 번호'}
            required
            errors={state?.error?.formErrors}
          />
        )}

        <Button>{!state.authentication ? '인증번호 전송' : '인증하기'} </Button>
      </form>
    </div>
  );
}

export default SMSPage;
