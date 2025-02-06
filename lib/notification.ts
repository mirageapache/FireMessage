import { db } from "@/firebase";
import {
  collection, getDocs, query, where,
} from "firebase/firestore";

/** 取得通知 */
export const getNotification = async (uid: string) => {
  try {
    const notificationRef = collection(db, "notifications");
    const notificationQuery = query(
      notificationRef,
      where("uid", "==", uid),
      where("isRead", "==", false),
      // orderBy("createdAt", "desc"),
    );
    const notificationSnapshot = await getDocs(notificationQuery);

    if (notificationSnapshot.empty) return { code: "NO_NOTIFICATION", count: 0 };
    const notificationData = notificationSnapshot.docs.map((doc) => doc.data());

    return { code: "SUCCESS", count: notificationSnapshot.docs.length, data: notificationData };
  } catch (error) {
    return { code: "ERROR", error };
  }
};
