'use client';

import React from 'react';
import { useFormState } from 'react-dom';
import { handleCreateAccount } from './server-action';
import { Button, Input, SocialButton } from '@/components';

function CreateAccountPage() {
  const [state, action] = useFormState(handleCreateAccount, null);

  return (
    <div className={'flex flex-col gap-10 py-8 px-6'}>
      <div className={'flex flex-col gap-2 *:font-medium'}>
        <h1 className={'text-2xl'}>회원가입</h1>
        <h2>회원이 되어 마켓을 둘러보세요!</h2>
      </div>
      <form className={'flex flex-col gap-3'} action={action}>
        <Input
          name={'name'}
          type={'text'}
          placeholder={'이름'}
          required
          minLength={3}
          maxLength={10}
          errors={state?.fieldErrors?.name || []}
        />
        <Input
          name={'email'}
          type={'email'}
          placeholder={'이메일'}
          required
          errors={state?.fieldErrors?.email || []}
        />
        <Input
          name={'password'}
          type={'password'}
          placeholder={'비밀번호'}
          required
          minLength={10}
          maxLength={20}
          errors={state?.fieldErrors?.password || []}
        />
        <Input
          name={'confirmPassword'}
          type={'password'}
          placeholder={'비밀번호 확인'}
          required
          minLength={10}
          maxLength={20}
          errors={state?.fieldErrors?.confirmPassword || []}
        />
        <Button>완료</Button>
      </form>
      <SocialButton />
    </div>
  );
}

export default CreateAccountPage;
