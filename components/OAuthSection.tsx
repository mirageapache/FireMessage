import React from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginOAuth } from "@/lib/auth";
import { authResponse } from "@/types/authType";

function OAuthSection() {
  const btnStyle = "flex justify-center items-center rounded-md cursor-pointer";
  const router = useRouter();

  const handleOAuth = async (provider: string) => {
    const result = await loginOAuth(provider) as authResponse;
    if (result.code === "SUCCESS") {
      router.push("/dashboard");
    } else {
      console.log(result);
      Swal.fire({
        title: '發生錯誤',
        icon: "error",
        confirmButtonText: "確定",
      });
    }
  };

  return (
    <div className="relative">
      <span className="flex justify-center my-[10px] before:[''] before:absolute before:w-full before:h-[1px] before:bg-white before:top-3">
        <span className="px-3 z-10 bg-[var(--background)]">or</span>
      </span>
      <h2 className="m-[10px]">快速登入</h2>
      <div className="flex justify-around">
        <Image
          src="/icons/google_icon.svg"
          alt="Google"
          width={48}
          height={48}
          className={`${btnStyle} bg-white rounded-[5px]`}
          onClick={() => handleOAuth("google")}
        />
        <Image
          src="/icons/fb_icon.png"
          alt="Facebook"
          width={48}
          height={48}
          className={`${btnStyle}`}
          onClick={() => handleOAuth("facebook")}
        />
        <Image
          src="/icons/github_icon.png"
          alt="Github"
          width={48}
          height={48}
          className={`${btnStyle} border-[3px] border-white bg-white rounded-[6px]`}
          onClick={() => handleOAuth("github")}
        />
      </div>
    </div>
  );
}

export default OAuthSection;
