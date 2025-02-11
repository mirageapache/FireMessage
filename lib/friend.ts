/* eslint-disable import/no-cycle */
/* eslint-disable max-len */

import { db } from "@/firebase";
import { friendStatusDataType } from "@/types/userType";
import {
  collection, query, where, getDocs,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getSimpleUserData } from "./user";
import { createNotification } from "./notification";

/** 建立好友 */
export const createFriend = async (uid: string, friendUid: string, status: number) => {
  try {
    const friendRef = collection(db, "friends");
    const friendQuery = query(friendRef, where("uid", "==", uid));
    const friendSnapshot = await getDocs(friendQuery);
    let friendList = [];
    if (!friendSnapshot.empty) friendList = friendSnapshot.docs[0].data().friendList;

    const variable = {
      uid: friendUid,
      status, // 0:預設(無狀態/非好友), 1:已發送邀請, 2:已收到邀請, 5:好友, 8:已移除, 9:已封鎖
      createdAt: new Date(),
    };

    await setDoc(doc(db, "friends", uid), {
      uid,
      friendList: [...friendList, variable],
    });
    return true;
  } catch (error) {
    return error;
  }
};

/** 更新好友狀態 */
export const updateFriendStatus = async (uid: string, friendUid: string, status: number) => {
  try {
    const friendRef = collection(db, "friends");
    const friendQuery = query(friendRef, where("uid", "==", uid));
    const friendSnapshot = await getDocs(friendQuery);
    let friendList = [];
    if (!friendSnapshot.empty) friendList = friendSnapshot.docs[0].data().friendList;

    await updateDoc(doc(db, "friends", uid), {
      friendList: friendList.map(
        (item: friendStatusDataType) => (item.uid === friendUid ? { ...item, status, createdAt: new Date() } : item),
      ),
    });

    return { code: 'SUCCESS', message: "更新好友狀態成功" };
  } catch (error) {
    return { code: 'ERROR', error };
  }
};

/** 發送好友邀請 */
export const createFriendRequest = async (uid: string, friendUid: string) => {
  try {
    await createFriend(uid, friendUid, 1);
    await createFriend(friendUid, uid, 2);
    await createNotification(friendUid, "friendRequest", "已發送好友邀請給你", uid);
    return { code: 'SUCCESS', message: "發送好友邀請成功" };
  } catch (error) {
    return { code: 'ERROR', message: "發送好友邀請失敗", error };
  }
};

/** 檢查好友狀態 */
export const checkFriendStatus = async (uid: string, friendUid: string) => {
  const friendRef = collection(db, "friends");
  const friendQuery = query(friendRef, where("uid", "==", uid));
  const friendSnapshot = await getDocs(friendQuery);
  let friendList = [];
  if (!friendSnapshot.empty) {
    friendList = friendSnapshot.docs[0].data().friendList;
    const friendStatus = friendList.find((item: friendStatusDataType) => {
      if (item.uid === friendUid) return item.status;
      return 0;
    });
    return friendStatus;
  }
  return 0;
};

/** 取得好友列表 */
export const getFriendList = async (uid: string, status: number) => {
  // status分類 0:預設(無狀態/非好友), 1:已發送邀請, 2:已收到邀請, 5:好友, 8:已移除, 9:已封鎖
  try {
    const friendRef = collection(db, "friends");
    const friendQuery = query(friendRef, where("uid", "==", uid));
    const friendSnapshot = await getDocs(friendQuery);
    if (friendSnapshot.empty) return { code: 'NO_DATA', data: [] };

    const friendPromise = friendSnapshot.docs[0].data().friendList
      .filter((friendDoc: friendStatusDataType) => friendDoc.status === status)
      .map(async (friendDoc: friendStatusDataType) => {
        const sourceUserData = await getSimpleUserData(friendDoc.uid);
        return {
          ...friendDoc,
          createdAt: friendDoc.createdAt.toDate().toISOString(),
          sourceUserData: sourceUserData || {},
        };
      });

    const friendList = await Promise.all(friendPromise);

    return { code: 'SUCCESS', data: friendList };
  } catch (error) {
    return { code: 'ERROR', error };
  }
};

/** 更新雙方好友狀態 */
export const updateBothFriendStatus = async (uid: string, friendUid: string, status: number) => {
  try {
    // 同時更新雙方狀態
    await Promise.all([
      updateFriendStatus(uid, friendUid, status),
      updateFriendStatus(friendUid, uid, status),
    ]);

    return { code: 'SUCCESS', message: "更新成功" };
  } catch (error) {
    console.error('更新好友狀態失敗:', error);
    return { code: 'ERROR', message: "更新失敗", error };
  }
};

/** 同意好友邀請 */
export const acceptFriendRequest = async (uid: string, friendUid: string) => {
  try {
    const result = await updateBothFriendStatus(uid, friendUid, 5);
    if (result.code === 'SUCCESS') {
      await createNotification(friendUid, "friendAccepted", "對方已接受您的好友邀請", uid);
    }
    return result;
  } catch (error) {
    return { code: 'ERROR', message: "接受好友邀請失敗", error };
  }
};

/** 拒絕好友邀請 */
export const rejectFriendRequest = async (uid: string, friendUid: string) => {
  const result = await updateBothFriendStatus(uid, friendUid, 0);

  return { code: 'SUCCESS', result };
};

/** 解除好友關係 */
export const unfriend = async (uid: string, friendUid: string) => {
  const result = await updateBothFriendStatus(uid, friendUid, 8);
  return { code: 'SUCCESS', result };
};
