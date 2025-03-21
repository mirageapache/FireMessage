import React from 'react';

function ItemLoading() {
  return (
    <div className="w-full my-4 border border-slate-400 shadow rounded-md p-2">
      <div className="animate-pulse flex space-x-4 items-center">
        <div className="rounded-full bg-slate-400 h-10 w-10" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-2 w-20 bg-slate-400 rounded mt-1" />
          <div className="flex items-center mt-1">
            <div className="h-2 w-20 bg-slate-400 rounded" />
          </div>
        </div>
        <div className="flex justify-center items-center gap-1 w-8 h-8">
          <div className="rounded-full bg-slate-400 h-1 w-1" />
          <div className="rounded-full bg-slate-400 h-1 w-1" />
          <div className="rounded-full bg-slate-400 h-1 w-1" />
        </div>
      </div>
    </div>
  );
}

export default ItemLoading;
