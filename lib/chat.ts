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
} from "firebase/firestore";
import { chatListInfoType } from "@/types/chatType";
import { userDataType } from "@/types/userType";
import { getSimpleUserData } from "./user";

/** 建立聊天室 */
export const createChatRoom = async (members: string[], type: number) => {
  const chatRoomRef = collection(db, "chatRooms");
  await addDoc(chatRoomRef, {
    members,
    type,
    chatRoomName: "",
    avatarUrl: "",
    bgColor: "",
    lastMessage: "",
    lastMessageTime: "",
    createdAt: new Date(),
  });
  return chatRoomRef.id;
};

/** 取得聊天室列表 */
export const getChatList = async (uid: string) => {
  try {
    const chatListRef = collection(db, "chatRooms");
    const chatListQuery = query(chatListRef, where("members", "array-contains", uid));
    const chatListSnapshot = await getDocs(chatListQuery);
    const chatListPromise = chatListSnapshot.docs.map(async (chatDoc) => {
      const data = chatDoc.data() as chatListInfoType;
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
        };
      }
      return {
        ...data,
        chatRoomId: chatDoc.id,
        lastMessageTime: data.lastMessageTime.toDate().toISOString(),
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });
    const chatList = await Promise.all(chatListPromise);
    return { code: "success", chatList };
  } catch (error) {
    return { code: "error", message: "取得聊天室列表失敗", error };
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
export const getMessages = async (chatRoomId: string, uid: string) => {
  try {
    const messagesRef = collection(db, "messages", chatRoomId, "chatMessages");
    const messagesQuery = query(
      messagesRef,
      orderBy("createdAt", "asc"),
    );
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

    const messageData = await Promise.all(messageDataPromise);
    return { code: "success", messageData };
  } catch (error) {
    return { code: "error", message: "取得聊天訊息失敗", error };
  }
};

/** 發送(即時)訊息 */
export const sendMessage = async (
  chatRoomInfo: chatListInfoType,
  userData: userDataType,
  message: string,
) => {
  try {
    await createMessage(chatRoomInfo.chatRoomId, userData.uid, message, "text");
    const {
      chatRoomId,
      members,
      chatRoomName,
      avatarUrl,
      bgColor,
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
        chatRoomName: chatRoomInfo.type === 0 ? userData.userName : chatRoomName,
        chatRoomAvatar: chatRoomInfo.type === 0 ? userData.avatarUrl : avatarUrl,
        chatRoomBgColor: chatRoomInfo.type === 0 ? userData.bgColor : bgColor,
        type: "sendMessage",
        createdAt: serverTimestamp(),
        isRead: false,
      });
    });

    return { code: "success", message: "訊息發送成功" };
  } catch (error) {
    return { code: "error", message: "訊息發送失敗", error };
  }
};
