import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children?: ReactNode;
}

function FormButton({ loading, children, ...rest }: FormButtonProps) {
  return (
    <button
      className={
        'primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed'
      }
      type={'button'}
      disabled={loading}
      {...rest}
    >
      {loading ? '로딩 중...' : children}
    </button>
  );
}

export default FormButton;
