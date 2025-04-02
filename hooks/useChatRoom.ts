import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getChatList, getMessages, updateReadStatus } from "@/lib/chat";
import { getOrganizationData } from "@/lib/organization";
import { chatRoomInfoType, messageDataType } from "@/types/chatType";
import { setActiveChatRoom, setChatList } from "@/store/chatSlice";
import { setUnReadMessageCount } from "@/store/sysSlice";
import { setOrganizationList } from "@/store/organizationSlice";
import { organizationDataType } from "@/types/organizationType";

export const useChatRoom = (uid: string, currentRoomId: string) => {
  const dispatch = useAppDispatch();
  const chatList = useAppSelector((state) => state.chat.chatList);
  const activeChatRoom = useAppSelector((state) => state.chat.activeChatRoom);
  const [messageList, setMessageList] = useState<messageDataType[]>([]);

  /** 取得聊天室訊息資料 */
  const handleGetMessage = async (roomId: string, activeRoomId: string) => {
    if (!activeRoomId || activeRoomId !== roomId) {
      return;
    }
    const result = await getMessages(roomId, uid!, activeChatRoom!.lastIndexTime, 20);
    if (result.code === "SUCCESS") {
      setMessageList([...messageList, ...(result.messageData as messageDataType[])]);
      dispatch(setActiveChatRoom({
        chatRoom: {
          ...activeChatRoom!,
          lastIndexTime: result.lastIndexTime,
          hasMore: result.hasMore!,
        },
      }));
    }
  };

  /** 取得聊天室列表資料 */
  const handleGetChatList = async () => {
    if (!uid) return;
    const result = await getChatList(uid!);
    if (result.code === "SUCCESS") {
      dispatch(setChatList(result.chatList as unknown as chatRoomInfoType[]));
      const count = result.chatList?.reduce((acc, item) => acc + item.unreadCount, 0) || 0;
      dispatch(setUnReadMessageCount(count));
      const currentChatRoomInfo = result.chatList?.find(
        (item) => item.chatRoomId === currentRoomId,
      );
      if (currentChatRoomInfo) {
        dispatch(setActiveChatRoom({ chatRoom: currentChatRoomInfo })); // 更新當前開啟的聊天室資料
      }
    }
  };

  /** 取得群組列表資料 */
  const handleGetOrgList = async () => {
    const result = await getOrganizationData(uid!);
    if (result.code === "SUCCESS") {
      dispatch(
        setOrganizationList(result.data as unknown as organizationDataType[]),
      );
    }
  };

  /** 更新讀取狀態 */
  const handleUpdateReadStatus = async (isSendMessage: boolean = false) => {
    if (!currentRoomId || !uid || !chatList) return;
    const currentRoom = chatList.find((item) => {
      if (item.chatRoomId === currentRoomId) {
        return item.unreadCount;
      }
      return 0;
    });
    if ((currentRoom && currentRoom.unreadCount > 0) || isSendMessage) {
      await updateReadStatus(currentRoomId, uid);
      handleGetChatList();
    }
  };

  useEffect(() => {
    handleGetMessage(currentRoomId, currentRoomId);
    handleGetChatList();
    handleGetOrgList();
    handleUpdateReadStatus();
  }, [uid]);

  return {
    messageList,
    setMessageList,
    handleGetMessage,
    handleGetChatList,
    handleGetOrgList,
    handleUpdateReadStatus,
  };
};
