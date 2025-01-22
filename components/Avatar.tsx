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
  classname: string;
  textSize: string;
  bgColor: string;
}) {
  const {
    userName,
    avatarUrl,
    classname,
    textSize,
    bgColor,
  } = props;

  if (isEmpty(avatarUrl) || avatarUrl === '') {
    if (userName) {
      const avatarName = userName.substring(0, 1).toUpperCase();
      return (
        <span
          style={{ backgroundColor: bgColor }}
          className={cn('rounded-full flex justify-center items-center font-semibold', classname)}
        >
          <p className={`${textSize} text-center text-white`}>{avatarName}</p>
        </span>
      );
    }
    return (
      <span className={`${classname} rounded-full flex justify-center items-center`}>
        <FontAwesomeIcon icon={faUser} size="lg" />
      </span>
    );
  }
  return <Image className={`${classname} rounded-full`} src={avatarUrl!} alt="avatar" width={25} height={25} />;
}

export default Avatar;
