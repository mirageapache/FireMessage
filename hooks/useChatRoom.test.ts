import { renderHook, act } from '@testing-library/react';
import { getChatList, getMessages, updateReadStatus } from '@/lib/chat';
import { getOrganizationData } from '@/lib/organization';
import { useChatRoom } from './useChatRoom';

// 模擬 API 調用
jest.mock('@/lib/chat');
jest.mock('@/lib/organization');

describe('useChatRoom', () => {
  const mockUid = 'test-user-id';
  const mockRoomId = 'test-room-id';

  beforeEach(() => {
    // 重置所有模擬
    jest.clearAllMocks();
  });

  test('是否正確初始化聊天室', async () => {
    (getChatList as jest.Mock).mockResolvedValue({
      code: 'SUCCESS',
      chatList: [
        {
          chatRoomId: mockRoomId,
          unreadCount: 0,
        },
      ],
    });

    (getMessages as jest.Mock).mockResolvedValue({
      code: 'SUCCESS',
      messageData: [],
    });

    (getOrganizationData as jest.Mock).mockResolvedValue({
      code: 'SUCCESS',
      data: [],
    });

    const { result } = renderHook(() => useChatRoom(mockUid, mockRoomId));

    // 驗證初始狀態
    expect(result.current.messageList).toEqual([]);

    // 等待所有非同步操作完成
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    // 驗證 API 是否被調用
    expect(getChatList).toHaveBeenCalledWith(mockUid);
    expect(getMessages).toHaveBeenCalledWith(mockRoomId, mockUid);
    expect(getOrganizationData).toHaveBeenCalledWith(mockUid);
  });

  test('是否正確處理未讀消息', async () => {
    const mockUnreadCount = 5;
    (getChatList as jest.Mock).mockResolvedValue({
      code: 'SUCCESS',
      chatList: [
        {
          chatRoomId: mockRoomId,
          unreadCount: mockUnreadCount,
        },
      ],
    });

    (updateReadStatus as jest.Mock).mockResolvedValue({
      code: 'SUCCESS',
    });

    const { result } = renderHook(() => useChatRoom(mockUid, mockRoomId));

    await act(async () => {
      await result.current.handleUpdateReadStatus(true);
    });

    expect(updateReadStatus).toHaveBeenCalledWith(mockRoomId, mockUid);
    expect(getChatList).toHaveBeenCalledWith(mockUid);
  });

  test('是否正確處理發送消息後的讀取狀態更新', async () => {
    const { result } = renderHook(() => useChatRoom(mockUid, mockRoomId));

    await act(async () => {
      await result.current.handleUpdateReadStatus(true);
    });

    expect(updateReadStatus).toHaveBeenCalledWith(mockRoomId, mockUid);
  });

  test('是否正確處理獲取消息列表', async () => {
    const mockMessages = [
      { id: 1, content: '測試訊息 1' },
      { id: 2, content: '測試訊息 2' },
    ];

    (getMessages as jest.Mock).mockResolvedValue({
      code: 'SUCCESS',
      messageData: mockMessages,
    });

    const { result } = renderHook(() => useChatRoom(mockUid, mockRoomId));

    await act(async () => {
      await result.current.handleGetMessage(mockRoomId, mockRoomId);
    });

    expect(result.current.messageList).toEqual(mockMessages);
  });
});
