import React, { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errors?: string[];
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ errors, ...props }, ref) => {
    return (
      <div className={'flex flex-col gap-2'}>
        <input
          ref={ref}
          {...props}
          className={
            'px-2.5 bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition duration-300  ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400'
          }
        />
        {errors?.map(err => (
          <span key={err} className={'text-red-500'}>
            {err}
          </span>
        ))}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
