import { useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { toast } from 'react-toastify';
import { realtimeDb } from '@/firebase';
import { immediateNotiDataType } from '@/types/notificationType';

export const useNotification = (uid: string, handleGetNotification: () => void) => {
  useEffect(() => {
    if (!uid) return;
    const notificationRef = ref(realtimeDb, `notifications/${uid}`);
    onValue(notificationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notifications = Object.values(data);
        const latestNotification = notifications[notifications.length - 1] as immediateNotiDataType;
        // 顯示即時通知
        toast(latestNotification.message);
        // 更新通知資料
        handleGetNotification();
      }
    });
  }, [uid]);
};
