/* eslint-disable import/no-cycle */
/* eslint-disable max-len */

import { db } from "@/firebase";
import {
  collection, getDocs, limit, query, where, QueryConstraint,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getSimpleUserData } from "./user";

/** 取得通知訊息 */
export const getNotification = async (uid: string, limitCount?: number) => {
  try {
    const notificationRef = collection(db, "notifications");
    const queryConditions: QueryConstraint[] = [
      where("uid", "==", uid),
      where("isRead", "==", false),
      // orderBy("createdAt", "desc"),
    ];

    if (limitCount) {
      queryConditions.push(limit(limitCount));
    }

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
        createdAt: data.createdAt.toDate().toISOString(),
        sourceUserData: sourceUserData || {},
      };
    });

    const notificationData = await Promise.all(notificationPromises);

    return { code: "SUCCESS", count: notificationSnapshot.docs.length, data: notificationData };
  } catch (error) {
    return { code: "ERROR", error };
  }
};

/** 建立通知訊息 */
export const createNotification = async (uid: string, type: string, content: string, sourceId: string) => {
  const notificationRef = collection(db, "notifications");
  await setDoc(doc(notificationRef, uid), {
    uid,
    type,
    content,
    sourceId, // 發送邀請的用戶ID，後續用來取得userData用的
    createdAt: new Date(),
    isRead: false,
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
