import React from 'react';

function AuthLayout(children: React.ReactNode) {
  return (
    <main className="flex justify-center items-center w-full h-full p-3">
      {children}
    </main>
  );
}

export default AuthLayout;
