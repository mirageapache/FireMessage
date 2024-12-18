'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
// import Image from 'next/image';

function HomeAuthSection() {
  const router = useRouter();

  return (
    <section className='flex w-screen h-screen'>
      <div className='flex items-center w-full bg-white z-10 bg-transparent'>
        <div className='flex justify-center items-center w-full sm:w-1/2 h-full'>
          <h1>Welcome, Fire Message!</h1>
          <p>
            This is a simple example of a Next.js page. To get started and save
            to see your changes.
          </p>
        </div>
        <div className='flex flex-col justify-center items-center w-full sm:w-1/2 h-full'>
          <Button className='w-28 m-5' onClick={() => router.push('/register')}>註冊</Button>
          <Button className='w-28 m-5' onClick={() => router.push('/login')}>登入</Button>
        </div>
      </div>
      <div className="fixed w-full h-screen bg-[url('/images/bg_image.png')] bg-cover bg-center opacity-50" />
    </section>
  );
}

export default HomeAuthSection;
