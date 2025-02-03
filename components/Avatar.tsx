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
      <span className={`${classname} rounded-full flex justify-center items-center bg-[var(--card-bg-color)]`}>
        <FontAwesomeIcon icon={faUser} size="lg" className={textSize} />
      </span>
    );
  }
  return <Image className={`${classname} rounded-full object-cover`} src={avatarUrl!} alt="avatar" width={100} height={100} />;
}

export default Avatar;
