/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { useEffect } from "react";
import { ref, onValue, update } from 'firebase/database';
import { toast } from 'react-toastify';
import { realtimeDb } from '@/firebase';
import { immediateMessageDataType } from "@/types/chatType";
import { isEmpty } from 'lodash';

export const useMessage = (
  uid: string,
  handleUpdateMessage: () => void,
) => {
  useEffect(() => {
    if (!uid) return;
    const messageRef = ref(realtimeDb, `messages/${uid}`);
    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (isEmpty(data)) return;

      const messageEntries = Object.entries(data);
      if (messageEntries.length === 0) return;

      const [latestId, latestData] = messageEntries[messageEntries.length - 1];
      const messageData = latestData as immediateMessageDataType;
      if (!messageData.isRead) {
        toast.update(latestId, {
          render: () => (
            <div>
              <p>UserName</p>
              <p>{messageData.message}</p>
            </div>
          ),
        });

        toast.info(messageData.message, { toastId: latestId }); // 顯示即時通知
        handleUpdateMessage(); // 更新聊天室訊息資料
      }

      // 刪除已讀的即時通知
      update(ref(realtimeDb), {
        [`messages/${uid}/${latestId}`]: null, // 設為 null 即可刪除該筆資料
      });
    });
  }, [uid]);
};
