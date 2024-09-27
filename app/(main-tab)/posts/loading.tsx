import React from 'react';

function LoadingPage() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index.toLocaleString()} className="*:rounded-md flex gap-5 ">
          <div className="flex flex-col gap-2 *:rounded-md">
            <div className="bg-neutral-700 h-5 w-20" />
            <div className="bg-neutral-700 h-5 w-40" />
            <div className="flex gap-2 *:rounded-md">
              <div className="bg-neutral-700 h-5 w-5" />
              <div className="bg-neutral-700 h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingPage;
