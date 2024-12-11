import React from 'react';
import Image from 'next/image';

function HomeAuthSection() {
  return (
    <section className="flex w-screen h-screen">
      <div className="flex items-center">
        <div>
          <h1>Welcome, Fire Message!</h1>
          <p>
            This is a simple example of a Next.js page. To get started and
            save to see your changes.
          </p>
          <Image
            className="dark:invert"
            src="https://nextjs.org/icons/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <h1>首頁</h1>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full bg-[url('/images/sectionOne.png')] bg-auto bg-center" />
    </section>
  );
}

export default HomeAuthSection;
