'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

function Header() {
  return (
    <header className='fixed t-0 w-full flex justify-between items-center p-5 border-b-[1px] border-gray-300'>
      <nav className='w-full md:max-w-[1200px]'>
        <Link href='/'>
          <Image
            src='/icons/fire_icon.png'
            alt='logo'
            width={40}
            height={40}
            priority
          />
          <h3>FireMessage</h3>
        </Link>
        <div>
          <button type='button' className='hidden sm:inline-block'>Dark Mode</button>
          <button type='button' className='hidden sm:inline-block'>Notification</button>
          <Link href='/userProfile'>User Profile</Link>
          <button type='button' className='inline-block sm:hidden'>Menu</button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
