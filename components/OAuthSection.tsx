import React from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginOAuth } from "@/lib/auth";
import { authResponseType } from "@/types/authType";
import { authErrorHandle } from "@/lib/error";

function OAuthSection() {
  const btnStyle = "flex justify-center items-center rounded-[6px] cursor-pointer";
  const router = useRouter();

  const handleOAuth = async (provider: string) => {
    const result = (await loginOAuth(provider)) as authResponseType;
    if (result.code === "SUCCESS") {
      router.push("/dashboard");
    } else {
      const msg = authErrorHandle(result.error.code);
      if (msg !== "") {
        Swal.fire({
          title: "發生錯誤",
          icon: "error",
          confirmButtonText: "確定",
        });
      }
    }
  };

  return (
    <div className="relative">
      <span className="flex justify-center my-[10px] before:[''] before:absolute before:w-full before:h-[1px] before:bg-[var(--divider-color)] before:top-3">
        <span className="px-3 z-10 bg-[var(--background)]">or</span>
      </span>
      <h2 className="m-[15px]">快速登入</h2>
      <div className="flex justify-around">
        <Image
          src="/icons/google_icon.svg"
          alt="Google"
          width={48}
          height={48}
          className={`${btnStyle} bg-white`}
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
          className={`${btnStyle} border-[3px] border-white bg-white`}
          onClick={() => handleOAuth("github")}
        />
      </div>
    </div>
  );
}

export default OAuthSection;
