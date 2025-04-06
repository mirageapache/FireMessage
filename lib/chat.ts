/* eslint-disable import/no-cycle */

import { db, realtimeDb } from "@/firebase";
import {
  push,
  ref,
  serverTimestamp,
  update,
} from "firebase/database";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  getDoc,
  setDoc,
  getCountFromServer,
  startAfter,
  limit,
} from "firebase/firestore";
import { chatRoomInfoType } from "@/types/chatType";
import { userDataType } from "@/types/userType";
import { getSimpleUserData } from "./user";

/** 建立聊天室 */
export const createChatRoom = async (
  members: string[],
  chatRoomName:string,
  avatarUrl:string,
  bgColor:string,
  type: number,
) => {
  const chatRoomRef = collection(db, "chatRooms");
  const docRef = await addDoc(chatRoomRef, {
    members,
    type,
    chatRoomName,
    avatarUrl,
    bgColor,
    lastMessage: "",
    lastMessageTime: new Date(),
    createdAt: new Date(),
  });
  return docRef.id;
};

/** 計算未讀訊息數 */
export const calculateUnreadMessageCount = async (chatRoomId: string, uid: string) => {
  // 取得所有聊天室最後讀取時間
  const readStatusRef = collection(db, "readStatus", uid, "chatRooms");
  const readStatusQuery = query(readStatusRef, where("chatRoomId", "==", chatRoomId));
  const readStatusSnapshot = await getDocs(readStatusQuery);

  // 如果沒有讀取狀態記錄，返回0
  if (readStatusSnapshot.empty) return 0;

  const readStatusData = readStatusSnapshot.docs[0].data();
  const messagesRef = collection(db, "messages", chatRoomId, "chatMessages");
  const messagesQuery = query(messagesRef, where("createdAt", ">", readStatusData.lastReadAt));
  const messagesSnapshot = await getCountFromServer(messagesQuery);

  return messagesSnapshot.data().count;
};

/** 取得聊天室列表 */
export const getChatList = async (uid: string) => {
  try {
    const chatListRef = collection(db, "chatRooms");
    const chatListQuery = query(chatListRef, where("members", "array-contains", uid));
    const chatListSnapshot = await getDocs(chatListQuery);

    const chatListPromise = chatListSnapshot.docs.map(async (chatDoc) => {
      const data = chatDoc.data() as chatRoomInfoType;
      const unreadCount = await calculateUnreadMessageCount(chatDoc.id, uid); // 計算未讀訊息數
      if (data.type === 0) {
        const friendUid = data.members.find((user: string) => user !== uid);
        const friendData = await getSimpleUserData(friendUid!) as unknown as userDataType;
        return {
          ...data,
          chatRoomId: chatDoc.id,
          chatRoomName: friendData.userName, // 聊天室類別為好友時，替換為對方名字、頭像、顏色
          avatarUrl: friendData.avatarUrl,
          bgColor: friendData.bgColor,
          lastMessageTime: data.lastMessageTime.toDate().toISOString(),
          createdAt: data.createdAt.toDate().toISOString(),
          unreadCount,
        };
      }
      return {
        ...data,
        chatRoomId: chatDoc.id,
        lastMessageTime: data.lastMessageTime.toDate().toISOString(),
        createdAt: data.createdAt.toDate().toISOString(),
        unreadCount,
      };
    });
    const chatList = await Promise.all(chatListPromise);
    return { code: "SUCCESS", chatList };
  } catch (error) {
    return { code: "ERROR", message: "取得聊天室列表失敗", error };
  }
};

/** 更新聊天室列表最後訊息 */
export const updateLastMessage = async (chatRoomId: string, message: string) => {
  const chatRoomRef = doc(db, "chatRooms", chatRoomId);
  await updateDoc(chatRoomRef, {
    lastMessage: message,
    lastMessageTime: new Date(),
  });
};

/** 更新讀取狀態 */
export const updateReadStatus = async (chatRoomId: string, uid: string) => {
  const readStatusRef = doc(db, "readStatus", uid, "chatRooms", chatRoomId);
  const readStatusData = await getDoc(readStatusRef);
  if (readStatusData.exists()) {
    await updateDoc(readStatusRef, {
      chatRoomId,
      lastReadAt: new Date(),
    });
  } else {
    await setDoc(readStatusRef, {
      chatRoomId,
      lastReadAt: new Date(),
    });
  }
};

/** 建立(傳送)聊天訊息 */
export const createMessage = async (
  chatRoomId: string,
  uid: string,
  message: string,
  type: string = 'text', // 訊息類型 (text, image, file...)
) => {
  const messagesRef = collection(db, "messages", chatRoomId, "chatMessages");

  await addDoc(messagesRef, {
    senderId: uid,
    message,
    type,
    createdAt: new Date(),
  });
  await updateLastMessage(chatRoomId, message); // 更新聊天室列表最後訊息
};

/** 取得聊天訊息 */
export const getMessages = async (
  chatRoomId: string,
  uid: string,
  lastIndexTime?: string, // 用時間戳記當作索引
  getLimit: number = 10,
) => {
  try {
    const messagesRef = collection(db, "messages", chatRoomId, "chatMessages");
    let messagesQuery = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      limit(getLimit),
    );

    if (lastIndexTime) {
      const lastCreatedAt = new Date(lastIndexTime); // 將 ISO 字串轉換回 Date 物件
      messagesQuery = query(
        messagesRef,
        orderBy("createdAt", "desc"),
        startAfter(lastCreatedAt),
        limit(getLimit),
      );
    }

    const messagesSnapshot = await getDocs(messagesQuery);
    const messageDataPromise = messagesSnapshot.docs.map(async (msg) => {
      const data = msg.data();
      const userData = await getSimpleUserData(data.senderId) as unknown as userDataType;
      return ({
        ...data,
        messageId: msg.id,
        isOwner: data.senderId === uid,
        createdAt: data.createdAt.toDate().toISOString(),
        senderData: userData,
      });
    });

    const messageData = (await Promise.all(messageDataPromise)).reverse();
    const lastVisible = messageData[0]?.createdAt;

    return {
      code: "SUCCESS",
      messageData,
      lastIndexTime: lastVisible,
      hasMore: messagesSnapshot.docs.length === getLimit,
    };
  } catch (error) {
    return { code: "ERROR", message: "取得聊天訊息失敗", error };
  }
};

/** 發送(即時)訊息 */
export const sendMessage = async (
  chatRoomInfo: chatRoomInfoType,
  userData: userDataType,
  message: string,
  sendingType: string = "text",
) => {
  try {
    await createMessage(chatRoomInfo.chatRoomId, userData.uid, message, sendingType);
    const {
      chatRoomId,
      members,
      chatRoomName,
      avatarUrl,
      bgColor,
      type,
    } = chatRoomInfo;
    // 建立即時通知
    members.forEach(async (memberId) => {
      // 更新該使用者於聊天室內未讀即時訊息(先刪除舊資料，再建立)
      await update(ref(realtimeDb), {
        [`messages/${memberId}`]: null, // 設為 null 即可刪除該筆資料
      });

      const messageRef = ref(realtimeDb, `messages/${memberId}`);
      await push(messageRef, {
        message,
        fromUid: userData.uid,
        members,
        chatRoomId,
        // 註：因為即時訊息通知是通知接收方，所以好友類型的聊天室名稱&頭貼設定發送者的頭貼
        chatRoomName: type === 0 ? userData.userName : chatRoomName,
        chatRoomAvatar: type === 0 ? userData.avatarUrl : avatarUrl,
        chatRoomBgColor: type === 0 ? userData.bgColor : bgColor,
        type: "sendMessage",
        chatRoomType: type,
        createdAt: serverTimestamp(),
        isRead: false,
      });
    });

    return { code: "SUCCESS", message: "訊息發送成功" };
  } catch (error) {
    return { code: "ERROR", message: "訊息發送失敗", error };
  }
};
