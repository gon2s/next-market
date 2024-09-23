import React from 'react';

const getProduct = async () => {
  await new Promise(res => {
    setTimeout(res, 10000);
  });
};

async function ProductsPage() {
  const products = await getProduct();
  return <div>ProductsPage</div>;
}

export default ProductsPage;
