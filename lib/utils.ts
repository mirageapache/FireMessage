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
