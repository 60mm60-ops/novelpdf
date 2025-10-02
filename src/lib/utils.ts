import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// mm to px conversion (96 DPI)
export const mmToPx = (mm: number): number => (mm * 96) / 25.4;

// pt to px conversion
export const ptToPx = (pt: number): number => (pt * 96) / 72;

// ページサイズをmm単位で取得
export const getPageSizeMm = (pageSize: string): { width: number; height: number } => {
  const sizes = {
    'A4': { width: 210, height: 297 },
    'A5': { width: 148, height: 210 },
    'B5': { width: 182, height: 257 },
    'B6': { width: 128, height: 182 },
  };
  return sizes[pageSize as keyof typeof sizes] || sizes.A4;
};

// ページサイズをピクセル単位で取得
export const getPageSizePx = (pageSize: string): { width: number; height: number } => {
  const sizeMm = getPageSizeMm(pageSize);
  return {
    width: mmToPx(sizeMm.width),
    height: mmToPx(sizeMm.height)
  };
};

// 文字数カウント（改行含む）
export const countCharacters = (text: string): number => {
  return text.replace(/\r\n/g, '\n').length;
};

// 行数カウント
export const countLines = (text: string): number => {
  return text.split('\n').length;
};

// フォント名の変換
export const getFontFamily = (fontType: string): string => {
  const fonts = {
    'mincho': '"Noto Serif JP", serif',
    'gothic': '"Noto Sans JP", sans-serif',
    'mono': '"Noto Sans Mono", monospace'
  };
  return fonts[fontType as keyof typeof fonts] || fonts.mincho;
};