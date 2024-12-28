import Image from "next/image";
import React from "react";

function OAuthSection() {
  const btnStyle = "flex justify-center items-center border-[1px] border-gray-300 rounded-md cursor-pointer";

  return (
    <div className="relative mt-[30px]">
      <span className="flex justify-center before:[''] before:absolute before:w-full before:h-[1px] before:bg-white before:top-3">
        <span className="px-3 z-10 bg-[var(--background)]">or</span>
      </span>
      <h2 className="m-[30px]">快速登入</h2>
      <div className="flex justify-around">
        <Image
          src="/icons/google_icon.svg"
          alt="Google"
          width={48}
          height={48}
          className={`${btnStyle} bg-white rounded-[5px]`}
        />
        <Image
          src="/icons/fb_icon.png"
          alt="Facebook"
          width={48}
          height={48}
          className={`${btnStyle} border-0`}
        />
        <Image
          src="/icons/github_icon.png"
          alt="Github"
          width={48}
          height={48}
          className={`${btnStyle} border-[3px] border-white bg-white rounded-[6px]`}
        />
      </div>
    </div>
  );
}

export default OAuthSection;
