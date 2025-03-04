import { db, realtimeDb } from "@/firebase";
import { chatDataType } from "@/types/chatType";
import { userDataType } from "@/types/userType";
import { push, ref, serverTimestamp } from "firebase/database";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

/** 建立聊天室 */
export const createChatRoom = async (member: string[]) => {
  const chatRoomRef = collection(db, "chatRooms");
  await addDoc(chatRoomRef, {
    member,
    createdAt: new Date(),
  });
  return chatRoomRef.id;
};

/** 取得聊天室列表 */
export const getChatList = async (uid: string) => {
  try {
    const chatListRef = collection(db, "chatRooms");
    const chatListQuery = query(chatListRef, where("member", "array-contains", uid));
    const chatListSnapshot = await getDocs(chatListQuery);
    const chatList = chatListSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });

    return { code: "success", chatList };
  } catch (error) {
    return { code: "error", message: "取得聊天室列表失敗", error };
  }
};

/** 建立(傳送)聊天訊息 */
export const createMessage = async (
  chatRoomId: string,
  uid: string,
  content: string,
  type: string = 'text',
) => {
  const messagesRef = collection(db, "messages", chatRoomId, "chatMessages");

  await addDoc(messagesRef, {
    senderId: uid,
    content,
    type,
    createdAt: new Date(),
  });
};

/** 取得聊天訊息 */
export const getMessages = async (chatRoomId: string) => {
  const messagesRef = collection(db, "messages");
  const messagesQuery = query(
    messagesRef,
    where("chatRoomId", "==", chatRoomId),
  );
  const messagesSnapshot = await getDocs(messagesQuery);
  return messagesSnapshot.docs.map((doc) => doc.data());
};

/** 發送(即時)訊息 */
export const sendMessage = async (
  chatRoomInfo: chatDataType,
  userData: userDataType,
  message: string,
) => {
  try {
    await createMessage(chatRoomInfo.chatRoomId, userData.uid, message, "sendMessage");
    const {
      chatRoomId,
      member,
      chatRoomName,
      avatarUrl,
      bgColor,
    } = chatRoomInfo;

    // 建立即時通知
    member.forEach(async (memberId) => {
      const messageRef = ref(realtimeDb, `messages/${memberId}`);
      await push(messageRef, {
        message,
        fromUid: userData.uid,
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
