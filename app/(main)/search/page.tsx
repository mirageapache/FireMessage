"use client";

import React, { useRef, useState } from 'react';
import UserItem from '@/components/UserItem';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { searchUser } from '@/lib/search';
import { userDataType } from '@/types/userType';
import { useAppSelector } from '@/store/hooks';
import { isEmpty } from 'lodash';
import Swal from 'sweetalert2';

function Search() {
  const userData = useAppSelector((state) => state.user.userData);
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<number | undefined>(); // 搜尋結果數量
  const [data, setData] = useState<userDataType[] | undefined>(); // 搜尋結果(資料)
  const existingHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]'); // 搜尋紀錄
  const inputRef = useRef<HTMLInputElement>(null);

  /** 處理搜尋功能 */
  const handleSearch = async (searchString: string) => {
    const result = await searchUser(searchString.trim(), userData?.uid || "");
    const dataList = result.data as userDataType[];

    if (result.code === "SUCCESS") {
      setSearchResult(result.count);
      setData(dataList);
    } else {
      setSearchResult(result.count);
    }
  };

  /** 處理搜尋紀錄點擊 */
  const handleHistoryClick = async (item: string) => {
    if (inputRef.current) {
      inputRef.current.value = item;
      setKeyword(item);
      handleSearch(item);
      const newHistory = [item, ...existingHistory.filter((ori: string) => ori !== item)]
        .slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  /** 處理搜尋紀錄 */
  const handleSearchHistory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keyword) {
      // 建立新的搜尋記錄陣列，移除重複項目並限制最多保存10筆
      const newHistory = [keyword, ...existingHistory.filter((item: string) => item !== keyword)]
        .slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  /** 清除搜尋紀錄 */
  const clearSearchHistory = () => {
    Swal.fire({
      title: "確定要清除搜尋紀錄嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('searchHistory');
        setKeyword("");
        setData([]);
        setSearchResult(undefined);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen pt-0 md:pt-5">
      <label aria-label="搜尋" htmlFor="search" className="relative flex items-center justify-center py-5 w-full md:max-w-[600px]">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 w-5 h-5 text-[var(--input-text-color)]" />
        <input
          id="search"
          type="text"
          placeholder="搜尋用戶或群組..."
          className="formInput pl-10"
          ref={inputRef}
          onChange={(e) => {
            setKeyword(e.target.value.trim());
            setData([]);
            setSearchResult(undefined);
            handleSearch(e.target.value);
          }}
          onKeyDown={(e) => handleSearchHistory(e)}
        />
        <button
          type="button"
          aria-label="清除搜尋"
          className="absolute top-[25px] right-3 w-8 h-8 py-1 text-[var(--input-text-color)] hover:text-[var(--active)] rounded-md"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = "";
            }
            setKeyword("");
            setData([]);
            setSearchResult(undefined);
          }}
        >
          <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
        </button>
      </label>
      <div className="w-full flex flex-col items-center justify-start">
        {isEmpty(keyword) && existingHistory.length === 0 && <h3>- 尚無搜尋紀錄 -</h3>}
        {isEmpty(keyword) && existingHistory.length !== 0 && (
          <div className="w-full flex flex-col items-center justify-center gap-1">
            <h3>搜尋紀錄</h3>
            <div className="w-full flex flex-col items-center justify-start gap-1 border-b border-[var(--divider-color)] pb-2">
              {existingHistory.map((item: string) => (
                <button
                  type="button"
                  className="py-2 px-3 hover:bg-[var(--hover-bg-color)] w-full text-left text-xl rounded-md"
                  key={item}
                  onClick={() => handleHistoryClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="清除搜尋紀錄"
              className="py-2 px-3 hover:bg-[var(--secondary)] text-left rounded-md"
              onClick={() => clearSearchHistory()}
            >
              清除紀錄
            </button>
          </div>
        )}

        {keyword !== "" && searchResult === 0 && <h2>找不到符合的用戶</h2>}
        {keyword !== "" && searchResult !== 0 && data && (
          <>
            <div className="w-full flex justify-start items-center mb-4 border-b border-[var(--divider-color)] text-xl">
              <button type="button" className="py-2 px-3 hover:bg-[var(--hover-bg-color)] rounded-t-md">用戶</button>
              <button type="button" className="py-2 px-3 hover:bg-[var(--hover-bg-color)] rounded-t-md">群組</button>
            </div>
            {data.map((item) => {
              if (item.uid === userData?.uid) return null;
              return (
                <UserItem
                  key={item.uid}
                  uid={item.uid}
                  userName={item.userName}
                  avatarUrl={item.avatarUrl}
                  userAccount={item.userAccount}
                  status={item.friendStatus}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
