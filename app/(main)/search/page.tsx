import React from 'react';
import UserItem from '@/components/UserItem';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Search() {
  return (
    <div className="flex flex-col items-center justify-start h-screen pt-0 md:pt-5">
      <label aria-label="搜尋" htmlFor="search" className="relative flex items-center justify-center py-5 w-full md:max-w-[600px]">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 w-5 h-5 text-[var(--input-text-color)]" />
        <input id="search" type="text" placeholder="搜尋..." className="formInput pl-10" />
      </label>
      <div className="w-full flex justify-start items-center mb-4 border-b border-[var(--divider-color)] text-xl">
        <button type="button" className="py-2 px-3 hover:bg-[var(--hover-bg-color)] rounded-t-md">用戶</button>
        <button type="button" className="py-2 px-3 hover:bg-[var(--hover-bg-color)] rounded-t-md">群組</button>
      </div>
      <div className="w-full flex flex-col items-center justify-start">
        <UserItem
          userName="Test1"
          avatarUrl=""
          userAccount="Test_1"
        />
        <UserItem
          userName="Test2"
          avatarUrl=""
          userAccount="Test_2"
        />
        <UserItem
          userName="Test3"
          avatarUrl=""
          userAccount="Test_3"
        />
      </div>
    </div>
  );
}

export default Search;
