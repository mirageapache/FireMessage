import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** className 合併 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 頭貼背景色轉換 */
export function bgColorConvert(color: string) {
  switch (color) {
    case '#ef4444':
      return 'bg-red-500';
    case '#f97316':
      return 'bg-orange-500';
    case '#f59e0b':
      return 'bg-amber-500';
    case '#eab308':
      return 'bg-yellow-500';
    case '#84cc16':
      return 'bg-lime-500';
    case '#22c55e':
      return 'bg-green-500';
    case '#10b981':
      return 'bg-emerald-500';
    case '#14b8a6':
      return 'bg-teal-500';
    case '#06b6d4':
      return 'bg-cyan-500';
    case '#0ea5e9':
      return 'bg-sky-500';
    case '#3b82f6':
      return 'bg-blue-500';
    case '#6366f1':
      return 'bg-indigo-500';
    case '#8b5cf6':
      return 'bg-violet-500';
    case '#a855f7':
      return 'bg-purple-500';
    case '#d946ef':
      return 'bg-fuchsia-500';
    case '#ec4899':
      return 'bg-pink-500';
    case '#f43f5e':
      return 'bg-rose-500';
    case '#78716c':
      return 'bg-stone-500';
    default:
      return 'bg-sky-600';
  }
}

/** 產生大頭貼背景顏色 */
export const getRandomColor = () => {
  const colorList = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
    '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#78716c',
  ];

  const index = Math.floor(Math.random() * (colorList.length + 1));
  return colorList[index];
};

/**
 * 計算1天內時間差距(Calculate Time Difference)
 * @param currentTime 現在時間(時間戳)
 * @param inputTime 輸入時間(時間戳)
 */
export const calcTimeDiff = (currentTime: number, inputTime: number) => {
  const diff = Math.abs(currentTime - inputTime); // 計算秒數差距

  if (diff < 60 * 60) {
    // 不足1小時
    const minutes = Math.floor(diff / 60);
    if (minutes < 1) {
      return '剛剛';
    }
    return `${minutes} 分鐘前`;
  }
  if (diff < 60 * 60 * 24) {
    // 不足24小時
    const hours = Math.floor(diff / (60 * 60));
    return `${hours} 小時前`;
  }
  // 超過24小時
  return '1 天';
};

/**
 * 文章、貼文顯示日期時間轉換
 * @param datetime (時間戳)日期時間
 */
export const formatDateTime = (datetime: string) => {
  const currentDate = new Date();
  const inputDate = new Date(datetime);
  const diffDays = Math.abs(currentDate.getDate() - inputDate.getDate());

  if (inputDate.getFullYear() === currentDate.getFullYear()) {
    if (inputDate.getMonth() === currentDate.getMonth() && diffDays < 7) {
      if (diffDays > 1) {
        // 少於一週以天數顯示
        return `${diffDays}天`;
      }
      // 少於1天以小時顯示
      const currentTime = parseInt(currentDate.getTime().toString().substring(0, 10), 10);
      const inputTime = parseInt(inputDate.getTime().toString().substring(0, 10), 10);
      return calcTimeDiff(currentTime, inputTime);
    }
    return `${inputDate.getMonth() + 1}月${inputDate.getDate()}日`;
  }
  return `${inputDate.getFullYear()}年${inputDate.getMonth() + 1}月${inputDate.getDate()}日`;
};
