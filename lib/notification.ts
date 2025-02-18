/* eslint-disable import/no-cycle */
/* eslint-disable max-len */

import { db, realtimeDb } from "@/firebase";
import {
  collection, getDocs, limit, query, where, QueryConstraint,
  doc,
  updateDoc,
  addDoc,
  writeBatch,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { push, ref } from "firebase/database";
import { getSimpleUserData } from "./user";

/** 取得通知訊息 */
export const getNotification = async (uid: string, limitCount?: number) => {
  try {
    const notificationRef = collection(db, "notifications");
    const queryConditions: QueryConstraint[] = [
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
    ];

    if (limitCount) queryConditions.push(limit(limitCount));

    const notificationQuery = query(
      notificationRef,
      ...queryConditions,
    );
    const notificationSnapshot = await getDocs(notificationQuery);

    if (notificationSnapshot.empty) return { code: "NO_NOTIFICATION", count: 0, data: [] };

    const notificationPromises = notificationSnapshot.docs.map(async (docItem) => {
      const data = docItem.data();
      const sourceUserData = await getSimpleUserData(data.sourceId);

      return {
        ...data,
        id: docItem.id,
        createdAt: data.createdAt.toDate().toISOString(),
        sourceUserData: sourceUserData || {},
        isChecked: data.isChecked,
      };
    });

    const notificationData = await Promise.all(notificationPromises);
    const unCheckedCount = notificationData.filter((item) => !item.isChecked).length;

    return { code: "SUCCESS", unCheckedCount, data: notificationData };
  } catch (error) {
    return { code: "ERROR", error };
  }
};

/** 建立通知訊息 */
export const createNotification = async (uid: string, type: string, content: string, sourceId: string) => {
  const notificationsRef = collection(db, "notifications");
  await addDoc(notificationsRef, {
    uid,
    type,
    content,
    sourceId, // 發送邀請的用戶ID，後續用來取得userData用的
    createdAt: new Date(),
    isRead: false,
    isChecked: false,
  });
};

/** 更新通知訊息 */
export const updateNotification = async (uid: string, type: string, content: string, sourceId: string, isRead: boolean) => {
  const notificationRef = collection(db, "notifications");
  await updateDoc(doc(notificationRef, uid), {
    type,
    content,
    sourceId,
    isRead,
  });
};

/** 更新通知訊息是否已查看 */
export const updateNotificationIsChecked = async (uid: string) => {
  try {
    const notificationRef = collection(db, "notifications");
    const notificationQuery = query(
      notificationRef,
      where("uid", "==", uid),
      where("isChecked", "==", false),
    );
    const notificationSnapshot = await getDocs(notificationQuery);

    if (notificationSnapshot.empty) return { code: "NULL", message: "沒有需要更新的通知" };

    const batch = writeBatch(db);

    notificationSnapshot.docs.forEach((docItem) => {
      batch.update(doc(notificationRef, docItem.id), {
        isChecked: true,
      });
    });
    await batch.commit();

    return { code: "SUCCESS", message: "成功更新" };
  } catch (error) {
    return { code: "ERROR", error };
  }
};

/** 更新通知訊息是否已讀 */
export const updateNotificationIsRead = async (notificationId: string) => {
  const notificationRef = collection(db, "notifications");
  await updateDoc(doc(notificationRef, notificationId), {
    isRead: true,
  });
};

/** 發送即時通知 */
export const sendImmediateNotification = async (uid: string, friendUid: string, type: string, message: string) => {
  // 在 Realtime Database 中建立通知
  const notificationRef = ref(realtimeDb, `notifications/${friendUid}`);
  await push(notificationRef, {
    type,
    message,
    fromUid: uid,
    timestamp: serverTimestamp(),
    isRead: false,
  });
};
