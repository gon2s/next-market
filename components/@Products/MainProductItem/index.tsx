import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface MainProductItemProps {
  id: number;
  title: string;
  photo: string;
  price: number;
  created_at: Date;
}

function MainProductItem({
  id,
  title,
  photo,
  price,
  created_at,
}: MainProductItemProps) {
  return (
    <Link href={`/products/${id}`} className={'flex gap-5'}>
      <div className={'relative size-28 rounded-md overflow-hidden'}>
        <Image fill src={photo} alt={title} />
      </div>
      <div className={'flex flex-col gap-1 *:text-white'}>
        <span className={'text-lg font-semibold'}>{title}</span>
        <span className={'text-sm text-neutral-500'}>
          {dayjs(created_at).format('YYYY.MM.DD')}
        </span>
        <span className={'text-lg font-semibold'}>
          {price.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}

export default MainProductItem;
