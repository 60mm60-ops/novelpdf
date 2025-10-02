# 小説入稿ツール - Novel Manuscript Tool

## プロジェクト概要
- **名前**: 小説入稿ツール (Novel Manuscript Tool)
- **目標**: 印刷通販向けの日本語縦書き対応PDF生成システム
- **技術スタック**: Next.js 15 + React 18 + TypeScript + Playwright + TailwindCSS

## 主な機能
- ✅ **日本語縦書き対応**: 縦書き・横書き両方サポート
- ✅ **フォント選択**: 明朝体・ゴシック体・等間隔フォント対応
- ✅ **段組み設定**: 1段〜3段の段組みレイアウト
- ✅ **印刷所規定PDF**: CMYK・トンボ・塗り足し対応
- ✅ **リアルタイムプレビュー**: 設定変更に応じた即座のプレビュー
- ✅ **レスポンシブUI**: デスクトップ・タブレット・モバイル対応

## URL・アクセス
- **開発環境**: https://3000-ilmef071rurha9rv99okh-6532622b.e2b.dev/
- **API エンドポイント**: `/api/generate-pdf`

## データ構造・ストレージ
### データモデル
```typescript
interface ManuscriptSettings {
  // 基本情報
  title: string
  author: string
  content: string
  
  // レイアウト設定
  fontSize: number        // pt
  lineHeight: number      // 倍率
  marginTop/Bottom/Left/Right: number  // mm
  
  // 日本語設定
  writingMode: 'vertical' | 'horizontal'
  fontFamily: 'mincho' | 'gothic' | 'mono'
  
  // 段組み設定
  columns: 1 | 2 | 3
  columnGap: number       // mm
  
  // ページ設定
  pageSize: 'A4' | 'A5' | 'B5' | 'B6'
  orientation: 'portrait' | 'landscape'
  
  // 印刷設定
  bleed: number           // mm (塗り足し)
  cropMarks: boolean      // トンボ
  colorMode: 'CMYK' | 'RGB' | 'Grayscale'
}
```

### ストレージ
- **PDF生成**: ローカルファイルシステム (`public/generated-pdfs/`)
- **フォント**: Google Fonts CDN (Noto Serif JP, Noto Sans JP, Noto Sans Mono)
- **状態管理**: React State (クライアントサイド)

## 使用方法
1. **原稿入力**: 左パネルでタイトル・著者・本文・レイアウト設定を入力
2. **プレビュー確認**: 中央パネルでリアルタイムプレビューを確認
3. **PDF生成**: 右パネルでPDF生成・ダウンロード

### サンプルの使用例
```
タイトル: テスト小説
著者: テスト作者
本文: 　これはテスト用の小説です。

　縦書きレイアウトでPDFが生成されます。

「テスト台詞です」

　本文のテストも行います。
```

## デプロイメント・設定
- **プラットフォーム**: Next.js 開発環境
- **ステータス**: ✅ アクティブ
- **最終更新**: 2024-09-30

### 起動方法
```bash
cd /home/user/webapp
npm install
npm run dev  # 開発サーバー起動 (port 3000)
```

### PDF生成テスト
```bash
# API テスト
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"settings": {...}, "outputFilename": "test.pdf"}'
```

## 技術詳細

### Playwrightによる高品質PDF生成
- **エンジン**: Chromium Headless Browser
- **レンダリング**: CSS `@page` ルール + `writing-mode` プロパティ
- **フォント**: Google Fonts WebFont + システムフォント fallback
- **出力**: 印刷所規定準拠PDF

### UIコンポーネント構造
```
src/
├── app/
│   ├── page.tsx           # メインページ
│   ├── layout.tsx         # レイアウト
│   ├── globals.css        # グローバルスタイル
│   └── api/generate-pdf/route.ts  # PDF生成API
├── components/
│   ├── ManuscriptForm.tsx    # 原稿入力フォーム
│   ├── PreviewPanel.tsx     # プレビューパネル
│   └── GenerationPanel.tsx  # PDF生成パネル
├── lib/
│   └── utils.ts          # ユーティリティ関数
└── types/
    └── index.ts          # TypeScript型定義
```

### 印刷所規定対応
- **塗り足し**: 0-10mm 設定可能
- **トンボ**: crop marks対応
- **カラーモード**: CMYK/RGB/Grayscale
- **ページサイズ**: A4/A5/B5/B6 (縦横対応)

## 開発完了状況
1. ✅ **プロジェクトセットアップ**: Next.js 15 + React 18環境構築完了
2. ✅ **UIコンポーネント**: 全コンポーネント実装・動作確認完了
3. ✅ **PDF生成API**: Playwright対応API実装・テスト完了
4. ✅ **日本語縦書き**: 縦書き・横書き・フォント選択完了
5. ✅ **段組み・印刷設定**: 段組み・印刷所規定PDF生成完了
6. ✅ **テスト・デバッグ**: 基本機能テスト完了

## 次のステップ推奨
1. **UI改良**: より詳細なプレビュー機能
2. **パフォーマンス向上**: 大容量原稿の分割処理
3. **テンプレート機能**: 小説・エッセイ・詩集等のテンプレート
4. **クラウドデプロイ**: Vercel/Netlify等へのデプロイ
5. **ユーザー管理**: 原稿保存・履歴機能