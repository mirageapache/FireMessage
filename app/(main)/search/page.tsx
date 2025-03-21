"use client";

import React, { useRef, useState } from 'react';
import UserItem from '@/components/UserItem';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { searchOrganization, searchUser } from '@/lib/search';
import { userDataType } from '@/types/userType';
import { useAppSelector } from '@/store/hooks';
import { isEmpty } from 'lodash';
import Swal from 'sweetalert2';
import { organizationDataType } from '@/types/organizationType';
import { cn } from '@/lib/utils';
import OrgItem from '@/components/OrgItem';

function Search() {
  const userData = useAppSelector((state) => state.user.userData);
  const [keyword, setKeyword] = useState("");
  const [userCount, setUserCount] = useState<number | undefined>(); // 用戶搜尋結果數量
  const [data, setData] = useState<userDataType[] | undefined>(); // 搜尋結果(資料)
  const [orgCount, setOrgCount] = useState<number | undefined>(); // 群組搜尋結果數量
  const [orgData, setOrgData] = useState<organizationDataType[] | undefined>(); // 搜尋結果(群組資料)
  const [activeTab, setActiveTab] = useState<string>("user"); // 搜尋結果(群組資料)
  const existingHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]'); // 搜尋紀錄
  const inputRef = useRef<HTMLInputElement>(null);

  /** 處理搜尋功能 */
  const handleSearch = async (searchString: string) => {
    const result = await searchUser(searchString.trim(), userData?.uid || "");
    const dataList = result.data as userDataType[];
    const orgResult = await searchOrganization(searchString.trim());
    const orgDataList = orgResult.data as organizationDataType[];

    if (result.code === "SUCCESS") {
      setUserCount(result.count);
      setData(dataList);
    } else {
      setUserCount(result.count);
    }

    if (orgResult.code === "SUCCESS") {
      setOrgCount(orgResult.count);
      setOrgData(orgDataList);
    } else {
      setOrgCount(orgResult.count);
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
        setUserCount(undefined);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen pt-0 md:pt-5">
      <label aria-label="搜尋" htmlFor="search" className="relative flex items-center justify-center py-5 w-full md:max-w-[600px]">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-7 w-5 h-5 text-[var(--input-text-color)]" />
        <input
          id="search"
          type="text"
          placeholder="搜尋用戶或群組..."
          className="formInput pl-[40px] mx-4"
          ref={inputRef}
          onChange={(e) => {
            setKeyword(e.target.value.trim());
            setData([]);
            setUserCount(undefined);
            handleSearch(e.target.value);
          }}
          onKeyDown={(e) => handleSearchHistory(e)}
        />
        <button
          type="button"
          aria-label="清除搜尋"
          className="absolute top-[25px] right-5 w-8 h-8 py-1 text-[var(--input-text-color)] hover:text-[var(--active)] rounded-lg"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = "";
            }
            setKeyword("");
            setData([]);
            setUserCount(undefined);
          }}
        >
          <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
        </button>
      </label>
      <div className="w-full flex flex-col items-center justify-start px-4">
        {isEmpty(keyword) && existingHistory.length === 0 && <h3>- 尚無搜尋紀錄 -</h3>}
        {isEmpty(keyword) && existingHistory.length !== 0 && (
          <div className="w-full flex flex-col items-center justify-center gap-1">
            <h3>搜尋紀錄</h3>
            <div className="w-full flex flex-col items-center justify-start gap-1 border-b border-[var(--divider-color)] pb-2">
              {existingHistory.map((item: string) => (
                <button
                  type="button"
                  className="py-2 px-3 hover:bg-[var(--hover-bg-color)] w-full text-left text-xl rounded-lg"
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
              className="py-2 px-3 hover:bg-[var(--secondary)] text-left rounded-lg"
              onClick={() => clearSearchHistory()}
            >
              清除紀錄
            </button>
          </div>
        )}

        {keyword !== "" && userCount === 0 && orgCount === 0 && <h2>找不到符合的用戶</h2>}
        {keyword !== "" && (userCount !== 0 && data) && (orgCount !== 0 && orgData) && (
          <>
            <div className="w-full flex justify-start items-center gap-1 mb-4 border-b border-[var(--divider-color)] text-xl">
              <button
                type="button"
                className={cn(
                  "w-full sm:w-auto py-2 px-3 hover:bg-[var(--hover-bg-color)] rounded-t-md",
                  activeTab === "user" && "bg-[var(--hover-bg-color)]",
                )}
                onClick={() => setActiveTab("user")}
              >
                用戶
                <span className="ml-2 px-[5px] text-xs bg-[var(--brand-secondary-color)] rounded-full text-white">
                  {userCount! > 999 ? '999+' : userCount}
                </span>
              </button>
              <button
                type="button"
                className={cn(
                  "w-full sm:w-auto py-2 px-3 hover:bg-[var(--hover-bg-color)] rounded-t-md",
                  activeTab === "org" && "bg-[var(--hover-bg-color)]",
                )}
                onClick={() => setActiveTab("org")}
              >
                群組
                <span className="ml-2 px-[5px] text-xs bg-[var(--brand-secondary-color)] rounded-full text-white">
                  {orgCount! > 999 ? '999+' : orgCount}
                </span>
              </button>
            </div>
            {activeTab === "user" ? (
              <>
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
                      bgColor={item.bgColor}
                      chatRoomId=""
                    />
                  );
                })}
              </>
            ) : (
              <>
                {orgData.map((item) => (
                  <OrgItem
                    key={item.orgId}
                    organizationName={item.organizationName}
                    avatarUrl={item.avatarUrl}
                    bgColor={item.bgColor}
                    members={item.members}
                    chatRoomId={item.chatRoomId}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
