'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fetchNextPage } from './server-action';
import { IProduct } from '@/@types';
import { MainProductItem } from '@/components/@Products';

interface ProductListComponentProps {
  dataList: IProduct[];
}

function ProductListComponent({ dataList }: ProductListComponentProps) {
  const trigger = useRef<HTMLSpanElement>(null);

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [data, setData] = useState<IProduct[]>(dataList);

  useEffect(() => {
    const observer = new IntersectionObserver(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (
        entries: IntersectionObserverEntry[],
        ob: IntersectionObserver,
      ) => {
        const el = entries[0];
        if (el.isIntersecting && trigger.current) {
          ob.unobserve(trigger.current);
          setIsLoading(true);
          const newProduct = await fetchNextPage(page);
          if (newProduct.length !== 0) {
            setPage(prev => prev + 1);
            setData(prev => [...prev, ...newProduct]);
          } else {
            setIsLast(true);
          }
          setIsLoading(false);
        }
      },
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5 mb-[100px]">
      {data.map(li => {
        return <MainProductItem key={li.id} {...li} />;
      })}
      {!isLast && (
        <span
          ref={trigger}
          className="mb-4 text-sm font-semibold  w-fit mx-auto px-3 py-5 rounded-md hover:opacity-90 active:scale-95 text-orange-400"
        >
          {isLoading ? '로딩 중' : ''}
        </span>
      )}
    </div>
  );
}

export default ProductListComponent;
