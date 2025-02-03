import { db } from "@/firebase";
import {
  collection, query, where, getDocs,
  updateDoc,
} from "firebase/firestore";

/** 取得使用者資料 */
export const getUserData = async (uid: string) => {
  try {
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef, where("uid", "==", uid));
    const usersSnapshot = await getDocs(usersQuery);
    return usersSnapshot.docs[0].data();
  } catch (error) {
    return { code: "ERROR", message: error };
  }
};

/** 更新使用者資料 */
export const updateUserData = async (
  uid: string,
  userName: string,
  userAccount: string,
  bio: string,
) => {
  try {
    const usersRef = collection(db, "users");
    // 檢查 userAccount 是否已存在
    const q = query(usersRef, where("userAccount", "==", userAccount));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty && querySnapshot.docs[0].id !== uid) return { code: "ERROR", message: "帳號已存在" };

    // 查詢使用者資料
    const usersQuery = query(usersRef, where("uid", "==", uid));
    const usersSnapshot = await getDocs(usersQuery);

    const updateData = {
      userName,
      userAccount,
      biography: bio,
    };

    // 更新使用者資料
    await updateDoc(usersSnapshot.docs[0].ref, updateData);
    return { code: "SUCCESS", message: "更新成功" };
  } catch (error) {
    return { code: "ERROR", message: "更新失敗，請稍後再試", error };
  }
};

/** 取得使用者設定檔 */
export const getUserSettings = async (uid: string) => {
  try {
    const userSettingsRef = collection(db, "userSettings");
    const userSettingsQuery = query(userSettingsRef, where("uid", "==", uid));
    const userSettingsSnapshot = await getDocs(userSettingsQuery);
    return userSettingsSnapshot.docs[0].data();
  } catch (error) {
    return { code: "ERROR", message: error };
  }
};
