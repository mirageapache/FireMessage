import { db } from "@/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

/** 建立(傳送)聊天訊息 */
export const createMessage = async (
  chatRoomId: string,
  uid: string,
  content: string,
) => {
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
