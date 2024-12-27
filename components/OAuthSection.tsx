import Image from "next/image";
import React from "react";

function OAuthSection() {
  const btnStyle = "flex justify-center items-center w-12 h-12 border-[1px] border-gray-300 rounded-md";
  // const iconStyle = "flex justify-center items-center";

  return (
    <div>
      <span className="text-center before:[''] before:absolute w-full h-[1px] bg-black">
        <p className="px-5">or</p>
      </span>
      <h2 className="m-[30px]">快速登入</h2>
      <div className="flex gap-4">
        <span className={`${btnStyle}`}>
          <Image src="/icons/google_icon.svg" alt="Google" />
        </span>
        <span className={`${btnStyle}`}>
          <Image src="/icons/fb_icon.svg" alt="Facebook" />
        </span>
        <span className={`${btnStyle}`}>
          <Image src="/icons/github_icon.svg" alt="Github" />
        </span>
      </div>
    </div>
  );
}

export default OAuthSection;
