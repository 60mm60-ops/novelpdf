// 小説入稿ツールの型定義

export interface ManuscriptSettings {
  // 基本設定
  title: string;
  author: string;
  content: string;
  
  // レイアウト設定
  fontSize: number; // pt
  lineHeight: number; // 倍率
  marginTop: number; // mm
  marginBottom: number; // mm
  marginLeft: number; // mm
  marginRight: number; // mm
  
  // 日本語設定
  writingMode: 'vertical' | 'horizontal';
  fontFamily: 'mincho' | 'gothic' | 'mono';
  
  // 段組み設定
  columns: 1 | 2 | 3;
  columnGap: number; // mm
  
  // ページ設定
  pageSize: 'A4' | 'A5' | 'B5' | 'B6';
  orientation: 'portrait' | 'landscape';
  
  // 印刷設定
  bleed: number; // mm (塗り足し)
  cropMarks: boolean; // トンボ
  colorMode: 'CMYK' | 'RGB' | 'Grayscale';
}

export interface PdfGenerationRequest {
  settings: ManuscriptSettings;
  outputFilename?: string;
}

export interface PdfGenerationResponse {
  success: boolean;
  filename?: string;
  downloadUrl?: string;
  error?: string;
  fileSize?: number;
  pageCount?: number;
}