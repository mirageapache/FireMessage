import { db } from "@/firebase";
import { friendDataType } from "@/types/userType";
import {
  collection, query, where, getDocs,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

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
  const friendRef = collection(db, "friends");
  const friendQuery = query(friendRef, where("uid", "==", uid));
  const friendSnapshot = await getDocs(friendQuery);
  let friendList = [];
  if (!friendSnapshot.empty) friendList = friendSnapshot.docs[0].data().friendList;

  await updateDoc(doc(db, "friends", uid), {
    friendList: friendList.map(
      (item: friendDataType) => (item.uid === friendUid ? { ...item, status } : item),
    ),
  });
};

/** 發送好友邀請 */
export const createFriendRequest = async (uid: string, friendUid: string) => {
  try {
    const currentResult = await createFriend(uid, friendUid, 1);
    const friendResult = await createFriend(friendUid, uid, 2);

    console.log(currentResult, friendResult);

    await setDoc(doc(db, "notifications", friendUid), {
      uid: friendUid,
      type: "friendRequest",
      content: "已發送好友邀請給你",
      sourceId: uid, // 發送邀請的用戶ID，後續用來取得userData用的
      createdAt: new Date(),
      isRead: false,
    });

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
    const friendStatus = friendList.find((item: friendDataType) => item.uid === friendUid)?.status;
    return friendStatus;
  }
  return 0;
};
