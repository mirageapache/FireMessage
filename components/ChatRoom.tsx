import React from 'react';
import { Textarea } from './ui/textarea';

function ChatRoom() {
  return (
    <div>
      {/* 訊息顯示區塊 message panel */}
      <div className="flex justify-center items-center flex-col gap-2">
        <div className="absolute top-0 left-0 w-full">
          <p>訊息內容1</p>
        </div>
        <div className="absolute top-0 right-0 w-full">
          <p>訊息內容2</p>
        </div>
      </div>
      {/* 訊息輸入區塊 input panel */}
      <div className="w-full border-t border-[var(--divider-color)]">
        <Textarea
          className="formInput resize-none w-full min-h-[100px]"
          maxLength={500}
          cols={10}
          placeholder="輸入訊息..."
        />
      </div>
    </div>
  );
}

export default ChatRoom;
