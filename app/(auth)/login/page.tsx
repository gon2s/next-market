'use client';

import React from 'react';
import { useFormState } from 'react-dom';
import { handleLogin } from './server-action';
import { Button, Input } from '@/components';

function LoginPage() {
  const [state, action] = useFormState(handleLogin, null);

  return (
    <div className={'flex flex-col gap-10 py-8 px-6'}>
      <div className={'flex flex-col gap-2 *:font-medium'}>
        <div className={'flex flex-row items-center gap-3'}>
          <h1 className={'text-3xl'}>🎃</h1>
          <h1 className={'text-2xl'}>Market</h1>
        </div>
        <h2>로그인</h2>
      </div>
      <form className={'flex flex-col gap-3'} action={action}>
        <Input
          name={'email'}
          type={'email'}
          placeholder={'Email'}
          required
          errors={state?.fieldErrors?.email || []}
        />
        <Input
          name={'password'}
          type={'password'}
          placeholder={'Password'}
          required
          minLength={10}
          maxLength={20}
          errors={state?.fieldErrors?.password || []}
        />

        <Button>로그인</Button>
      </form>
      {/* <SocialButton /> */}
    </div>
  );
}

export default LoginPage;
