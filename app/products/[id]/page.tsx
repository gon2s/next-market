import { UserIcon } from '@heroicons/react/24/solid';
import { unstable_cache as nextCache } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import { deleteProductAction } from './server-action';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

const getIsOwner = async (userId: number) => {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return null;
};

const getProductDetail = async (id: number) => {
  const productInfo = db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          profile_img: true,
        },
      },
    },
  });
  return productInfo;
};

const getProductTitle = async (id: number) => {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
};

const getCachedProductTitle = nextCache(getProductTitle, ['product-title'], {
  tags: ['product-title'],
});

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}) => {
  const res = await getCachedProductTitle(Number(params.id));
  return {
    title: res?.title,
  };
};

interface ProductDetailPageProps {
  params: { id: string };
}

async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = Number(params.id);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(productId)) {
    return notFound();
  }

  const productDetail = await getProductDetail(productId);
  if (!productDetail) {
    return notFound();
  }

  const isOwner = await getIsOwner(productDetail.userId);

  const handleRevalidate = async () => {
    'use server';

    await deleteProductAction({ id: Number(params.id) });
  };

  return (
    <div>
      <div className="relative aspect-square max-w-[480px] mx-auto">
        <Image
          priority
          fill
          src={`${productDetail.photo}/public`}
          alt={productDetail.title}
          className={'object-cover'}
        />
      </div>
      <div className="max-w-[480px] mx-auto">
        <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
          <div className="size-10 overflow-hidden rounded-full">
            {productDetail.user?.profile_img !== null ? (
              <Image
                priority
                src={productDetail.user.profile_img}
                width={40}
                height={40}
                alt={productDetail.user.username}
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <div>
            <h3>{productDetail.user.username}</h3>
          </div>
        </div>
        <div className="p-5 mb-[100px]">
          <h1 className="text-2xl font-semibold">{productDetail.title}</h1>
          <p>{productDetail.description}</p>
        </div>
      </div>
      <div className="fixed left-0 bottom-0 w-full h-[100px] p-5 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {`${productDetail.price.toLocaleString()}원`}
        </span>
        {isOwner ? (
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          <form action={handleRevalidate}>
            <button
              className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
              type={'submit'}
            >
              Delete product
            </button>
          </form>
        ) : null}
        <Link
          className={
            'bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold'
          }
          href={`/chat`}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}

export default ProductDetailPage;
