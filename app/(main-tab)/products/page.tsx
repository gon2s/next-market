import { PlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React from 'react';
import { ProductListComponent } from './components';
import db from '@/lib/db';

export const generateMetadata = () => {
  return {
    title: '홈',
  };
};

const getProduct = async () => {
  const product = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
    take: 1,
  });
  return product;
};

async function ProductsPage() {
  const products = await getProduct();
  return (
    <div>
      <ProductListComponent dataList={products} />
      <Link
        href={'products/add'}
        className={
          'bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400'
        }
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}

export default ProductsPage;
