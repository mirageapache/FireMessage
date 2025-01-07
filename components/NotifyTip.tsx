import React from 'react';

function NotifyTip({ amount }: { amount: number }) {
  return (
    <span className="absolute top-[-10px] left-1/2 translate-x-[5px] px-[4px] text-xs bg-red-500 rounded-full flex justify-center items-center text-white">
      {amount > 999 ? '999+' : amount}
    </span>
  );
}

export default NotifyTip;
