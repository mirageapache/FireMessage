import React from "react";

function OAuthSection() {
  return (
    <div>
      <h2>快速登入</h2>
      <div className="flex gap-4">
        <span className="border-[1px] border-gray-300">google</span>
        <span className="border-[1px] border-gray-300">fb</span>
        <span className="border-[1px] border-gray-300">github</span>
      </div>
    </div>
  );
}

export default OAuthSection;
