import React from 'react';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
// --- functions ---
import { cn } from '@/lib/utils';
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

  if (isEmpty(avatarUrl) || avatarUrl === '') {
    if (userName) {
      const avatarName = userName.substring(0, 1).toUpperCase();
      return (
        <span
          style={{ backgroundColor: bgColor }}
          className={cn('rounded-full flex justify-center items-center font-semibold cursor-default', size)}
        >
          <p className={`${textSize} text-center text-white`}>{avatarName}</p>
        </span>
      );
    }
    return (
      <span className={`${size} rounded-full flex justify-center items-center`}>
        <FontAwesomeIcon icon={faUser} size="lg" />
      </span>
    );
  }
  return <Image className={`${size} rounded-full`} src={avatarUrl!} alt="avatar" width={25} height={25} />;
}

export default Avatar;
