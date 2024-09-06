import React from 'react';
import { FormButton, FormInput } from '@/components';

function SMSPage() {
  return (
    <div className={'flex flex-col gap-10 py-8 px-6'}>
      <div className={'flex flex-col gap-2 *:font-medium'}>
        <h1 className={'text-2xl'}>SMS 로그인</h1>
        <h2>휴대폰 번호로 로그인하기</h2>
      </div>
      <form className={'flex flex-col gap-3'} action="">
        <FormInput
          type={'number'}
          placeholder={'휴대폰 번호'}
          required
          errors={[]}
        />
        <FormInput
          type={'number'}
          placeholder={'인증 번호'}
          required
          errors={[]}
        />

        <FormButton>인증하기</FormButton>
      </form>
    </div>
  );
}

export default SMSPage;
