/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { toast } from 'react-toastify';
import { realtimeDb } from '@/firebase';
import { immediateNotiDataType } from '@/types/notificationType';
import { isEmpty } from 'lodash';

export const useNotification = (
  uid: string,
  handleGetNotification: () => void,
  handleUpdateFriend: () => void,
) => {
  useEffect(() => {
    if (!uid) return;
    const notificationRef = ref(realtimeDb, `notifications/${uid}`);
    onValue(notificationRef, (snapshot) => { // 監聽資料變化的方法，當資料發生變化時會觸發回調函數
      const data = snapshot.val();
      if (isEmpty(data)) return;

      const notificationEntries = Object.entries(data);
      if (notificationEntries.length === 0) return;

      const [latestId, latestData] = notificationEntries[notificationEntries.length - 1];
      const notiData = latestData as immediateNotiDataType;
      if (!notiData.isRead) {
        toast.info(notiData.message, { toastId: latestId }); // 顯示即時通知
        handleGetNotification(); // 更新通知資料

        // 更新好友資訊
        if (notiData.type === "friendAccepted") {
          handleUpdateFriend();
        }

        // 直接刪除已讀的即時通知
        update(ref(realtimeDb), {
          [`notifications/${uid}/${latestId}`]: null, // 設為 null 即可刪除該筆資料
        });
      }
    });
  }, [uid]);
};
