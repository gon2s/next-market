import React from 'react';
import { ProductListComponent } from './components';
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
    take: 1,
  });
  return product;
};

async function ProductsPage() {
  const products = await getProduct();
  return <ProductListComponent dataList={products} />;
}

export default ProductsPage;
