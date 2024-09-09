/* eslint-disable react/button-has-type */
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children?: ReactNode;
}

function FormButton({ loading, children, ...rest }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={
        'primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed'
      }
      type={'submit' || rest.type}
      disabled={pending}
      {...rest}
    >
      {pending ? '로딩 중...' : children}
    </button>
  );
}

export default FormButton;
