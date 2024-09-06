import React from 'react';
import { FormButton, FormInput, SocialButton } from '@/components';

function CreateAccountPage() {
  return (
    <div className={'flex flex-col gap-10 py-8 px-6'}>
      <div className={'flex flex-col gap-2 *:font-medium'}>
        <h1 className={'text-2xl'}>회원가입</h1>
        <h2>회원이 되어 마켓을 둘러보세요!</h2>
      </div>
      <form className={'flex flex-col gap-3'} action="">
        <FormInput type={'text'} placeholder={'이름'} required errors={[]} />
        <FormInput type={'email'} placeholder={'이메일'} required errors={[]} />
        <FormInput
          type={'password'}
          placeholder={'비밀번호'}
          required
          errors={[]}
        />
        <FormInput
          type={'password'}
          placeholder={'비밀번호 확인'}
          required
          errors={[]}
        />
        <FormButton>가입하기</FormButton>
      </form>
      <SocialButton />
    </div>
  );
}

export default CreateAccountPage;
