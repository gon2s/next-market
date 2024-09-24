'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fetchNextPage } from '../../server-action';
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
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
      ) => {
        const el = entries[0];
        if (el.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
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
    <div className="p-5 flex flex-col gap-5">
      {data.map(li => {
        return <MainProductItem key={li.id} {...li} />;
      })}
      {!isLast && (
        <span
          ref={trigger}
          style={{
            marginTop: `${page + 1 * 900}vh`,
          }}
          className="mb-[100px] text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? '로딩 중' : 'Load more'}
        </span>
      )}
    </div>
  );
}

export default ProductListComponent;
