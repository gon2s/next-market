import React from 'react';
import { MainProductItem } from '@/components/@Products';
import db from '@/lib/db';

const getProduct = async () => {
  const product = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
  });
  return product;
};

async function ProductsPage() {
  const products = await getProduct();
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map(li => {
        return <MainProductItem key={li.id} {...li} />;
      })}
    </div>
  );
}

export default ProductsPage;
