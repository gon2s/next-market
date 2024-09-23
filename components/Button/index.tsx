'use client';

/* eslint-disable react/button-has-type */
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children?: ReactNode;
}

function Button({ loading, children, ...rest }: ButtonProps) {
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

export default Button;
