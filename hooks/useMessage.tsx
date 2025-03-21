/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { useEffect } from "react";
import Cookies from 'universal-cookie';
import { ref, onValue, update } from 'firebase/database';
import { toast } from 'react-toastify';
import { realtimeDb } from '@/firebase';
import { immediateMessageDataType } from "@/types/chatType";
import { isEmpty } from 'lodash';
import ChatItem from "@/components/ChatItem";

export const useMessage = (
  uid: string,
  pathname: string,
  currentRoomId: string,
  handleGetMessage: (values: string, values2: string) => void,
  handleGetChatList: () => void,
) => {
  const cookies = new Cookies();
  const isLogin = !isEmpty(cookies.get("UAT"));

  useEffect(() => {
    if (!uid || !isLogin) return;
    const messageRef = ref(realtimeDb, `messages/${uid}`);
    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (isEmpty(data)) return;

      const messageEntries = Object.entries(data);
      if (messageEntries.length === 0) return;
      const [latestId, latestData] = messageEntries[messageEntries.length - 1];
      const messageData = latestData as immediateMessageDataType;
      if (!messageData.isRead) {
        if (messageData.fromUid !== uid) {
          // 接收方的使用者顯示通知並更新聊天室訊息資料
          if (pathname === "header") {
            toast(
              <ChatItem
                key={messageData.chatRoomId}
                chatRoomId={messageData.chatRoomId}
                members={messageData.member}
                chatRoomName={messageData.chatRoomName}
                avatarUrl={messageData.chatRoomAvatar}
                bgColor={messageData.chatRoomBgColor}
                lastMessage={messageData.message}
                lastMessageTime={messageData.createdAt}
                unreadCount={0}
                showCount={false}
                type={messageData.chatRoomType}
                isNoti={true}
              />,
              { toastId: latestId },
            );
          }
        }
        handleGetChatList(); // 更新聊天室列表資料
        if (pathname === "chatroom" && currentRoomId === messageData.chatRoomId) {
          handleGetMessage(messageData.chatRoomId, currentRoomId); // 更新聊天室訊息資料
        }
      }

      // 刪除已讀的即時通知
      update(ref(realtimeDb), {
        [`messages/${uid}/${latestId}`]: null, // 設為 null 即可刪除該筆資料
      });
    });
  }, [uid, currentRoomId]);
};
