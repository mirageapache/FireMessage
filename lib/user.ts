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
  username: string,
  account: string,
  bio: string,
) => {
  try {
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef, where("uid", "==", uid));
    const usersSnapshot = await getDocs(usersQuery);

    const updateData = {
      userName: username,
      userAccount: account,
      biography: bio,
    };

    await updateDoc(usersSnapshot.docs[0].ref, updateData);
    return { code: "SUCCESS", message: "更新成功" };
  } catch (error) {
    return { code: "ERROR", message: error };
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
