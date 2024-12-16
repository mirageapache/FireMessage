import React from 'react';
// import Image from 'next/image';

function HomeAuthSection() {
  return (
    <section className="flex w-screen h-screen">
      <div className="flex items-center bg-white z-10 bg-transparent">
        <div>
          <h1>Welcome, Fire Message!</h1>
          <p>
            This is a simple example of a Next.js page. To get started and save
            to see your changes.
          </p>
          {/* <Image
          className="dark:invert"
          src="/icons/fire_icon.png"
          alt="logo"
          width={60}
          height={60}
          priority
        />
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <h1>首頁</h1>
        </div> */}
        </div>
        <div>
          <p>註冊&登入</p>
        </div>
      </div>
      <div className="fixed w-full h-screen bg-[url('/images/bg_image.png')] bg-cover bg-center opacity-50" />
    </section>
  );
}

export default HomeAuthSection;
