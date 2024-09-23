import React from 'react';

function Loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index.toLocaleString()} className="*:rounded-md flex gap-5 ">
          <div className="size-28 bg-neutral-700" />
          <div className="flex flex-col gap-2 *:rounded-md">
            <div className="bg-neutral-700 h-5 w-40" />
            <div className="bg-neutral-700 h-5 w-20" />
            <div className="bg-neutral-700 h-5 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Loading;
