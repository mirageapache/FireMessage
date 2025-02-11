/* eslint-disable max-len */

import { db } from "@/firebase";
import {
  collection, getDocs, limit, query, where, QueryConstraint,
} from "firebase/firestore";
import { getSimpleUserData } from "./user";

/** 取得通知 */
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

    const notificationPromises = notificationSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const sourceUserData = await getSimpleUserData(data.sourceId);

      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        sourceUserData: sourceUserData || {},
      };
    });

    const notificationData = await Promise.all(notificationPromises);

    return { code: "SUCCESS", count: notificationSnapshot.docs.length, data: notificationData };
  } catch (error) {
    return { code: "ERROR", error };
  }
};
