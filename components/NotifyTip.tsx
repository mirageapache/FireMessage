import React from 'react';

function NotifyTip({ amount }: { amount: number }) {
  if (amount === 0) return null;
  return (
    <span className="absolute top-[-10px] left-1/2 translate-x-[5px] px-[5px] text-xs bg-red-500 rounded-full text-white">
      {amount > 999 ? '999+' : amount}
    </span>
  );
}

export default NotifyTip;
