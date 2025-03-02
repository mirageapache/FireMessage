import { db, realtimeDb } from "@/firebase";
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
  chatRoomId: string,
  uid: string,
  friendUid: string,
  message: string,
  type: string = 'sendMessage',
) => {
  try {
    await createMessage(chatRoomId, uid, message, type);

    // 建立即時通知
    const messageRef = ref(realtimeDb, `messages/${friendUid}`);
    await push(messageRef, {
      message,
      fromUid: uid,
      type,
      createdAt: serverTimestamp(),
      isRead: false,
    });

    return { code: "success", message: "訊息發送成功" };
  } catch (error) {
    return { code: "error", message: "訊息發送失敗", error };
  }
};
