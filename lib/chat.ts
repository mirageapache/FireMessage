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
};

/** 建立(傳送)聊天訊息 */
export const createMessage = async (chatRoomId: string, uid: string, content: string) => {
  const messagesRef = collection(db, "messages");
  await addDoc(messagesRef, {
    chatRoomId,
    senderId: uid,
    content,
    createdAt: new Date(),
    isRead: false,
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
export const sendMessage = async (uid: string, friendUid: string, message: string) => {
  // await createMessage(chatRoomId, uid, message);

  const messageRef = ref(realtimeDb, `messages/${friendUid}`);
  await push(messageRef, {
    message,
    fromUid: uid,
    timestamp: serverTimestamp(),
    isRead: false,
  });
};
