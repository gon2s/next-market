import React from 'react';
import { FormButton, FormInput, SocialButton } from '@/components';

function LoginPage() {
  return (
    <div className={'flex flex-col gap-10 py-8 px-6'}>
      <div className={'flex flex-col gap-2 *:font-medium'}>
        <div className={'flex flex-row items-center gap-3'}>
          <h1 className={'text-3xl'}>🎃</h1>
          <h1 className={'text-2xl'}>Market</h1>
        </div>
        <h2>로그인</h2>
      </div>
      <form className={'flex flex-col gap-3'} action="">
        <FormInput type={'email'} placeholder={'Email'} required errors={[]} />
        <FormInput
          type={'password'}
          placeholder={'Password'}
          required
          errors={[]}
        />

        <FormButton>Create Account</FormButton>
      </form>
      <SocialButton />
    </div>
  );
}

export default LoginPage;
