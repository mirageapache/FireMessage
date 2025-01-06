import React from 'react';

function NotifyTip({ amount }: { amount: number }) {
  return (
    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex justify-center items-center text-white">
      {amount > 999 ? '999+' : amount}
    </span>
  );
}

export default NotifyTip;
