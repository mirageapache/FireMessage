import React from 'react';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
// --- functions ---
import { bgColorConvert } from '@/lib/utils';
import Image from 'next/image';

function Avatar(props: {
  userName: string | null;
  avatarUrl: string | null;
  size: string;
  textSize: string;
  bgColor: string;
}) {
  const {
    userName,
    avatarUrl,
    size,
    textSize,
    bgColor,
  } = props;
  const colorStyle = bgColorConvert(bgColor);

  if (isEmpty(avatarUrl)) {
    if (userName) {
      const avatarName = userName.substring(0, 1).toUpperCase();
      return (
        <span
          className={`${size} ${colorStyle} rounded-full flex justify-center items-center font-semibold cursor-default`}
        >
          <p className={`${textSize} text-center text-white`}>{avatarName}</p>
        </span>
      );
    }
    return (
      <span className={`${size} rounded-full flex justify-center items-center border`}>
        <FontAwesomeIcon icon={faUser} size="2x" />
      </span>
    );
  }
  return <Image className={`${size} rounded-full`} src={avatarUrl!} alt="avatar" />;
}

export default Avatar;
