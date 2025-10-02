'use client'

import { ManuscriptSettings } from '@/types'
import { getFontFamily, getPageSizeMm } from '@/lib/utils'
import { Eye, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

interface PreviewPanelProps {
  settings: ManuscriptSettings
}

export function PreviewPanel({ settings }: PreviewPanelProps) {
  const [zoom, setZoom] = useState(50) // 50%から開始

  // 縦中横処理関数
  const processSimpleTateChuYoko = (text: string): string => {
    return text.replace(/(?<!\d)\d{1,2}(?!\d)/g, '<span class="num-tcy">$&</span>');
  }

  const pageSize = getPageSizeMm(settings.pageSize)
  const isLandscape = settings.orientation === 'landscape'
  
  // ページサイズを調整（横向きの場合は幅と高さを入れ替え）
  const displayWidth = isLandscape ? pageSize.height : pageSize.width
  const displayHeight = isLandscape ? pageSize.width : pageSize.height

  // プレビュー用のスケール計算
  const scale = zoom / 100
  const previewWidth = (displayWidth * scale * 3.78) // mm to px approximation
  const previewHeight = (displayHeight * scale * 3.78)

  // 余白をピクセルに変換
  const marginTopPx = (settings.marginTop * scale * 3.78)
  const marginBottomPx = (settings.marginBottom * scale * 3.78)
  const marginLeftPx = (settings.marginLeft * scale * 3.78)
  const marginRightPx = (settings.marginRight * scale * 3.78)

  // テキスト領域の計算
  const textAreaWidth = previewWidth - marginLeftPx - marginRightPx
  const textAreaHeight = previewHeight - marginTopPx - marginBottomPx

  // フォント設定
  const fontFamily = getFontFamily(settings.fontFamily)
  const fontSize = settings.fontSize * scale * 0.75 // pt to px approximation with scale

  // 段組み設定
  const columnWidth = settings.columns > 1 
    ? (textAreaWidth - (settings.columnGap * scale * 3.78 * (settings.columns - 1))) / settings.columns
    : textAreaWidth

  // 本文を段落に分割
  const paragraphs = settings.content.split('\n\n').filter(p => p.trim())

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 10))
  }

  const resetZoom = () => {
    setZoom(50)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">プレビュー</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-gray-100"
            title="縮小"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <button
            onClick={resetZoom}
            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
            title="リセット"
          >
            {zoom}%
          </button>
          
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-gray-100"
            title="拡大"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ページ情報 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 space-y-1">
          <div>ページサイズ: {settings.pageSize} ({displayWidth}×{displayHeight}mm)</div>
          <div>向き: {settings.orientation === 'portrait' ? '縦向き' : '横向き'}</div>
          <div>書字方向: {settings.writingMode === 'vertical' ? '縦書き' : '横書き'}</div>
          <div>段組み: {settings.columns}段</div>
          <div>フォント: {settings.fontFamily === 'mincho' ? '明朝体' : settings.fontFamily === 'gothic' ? 'ゴシック体' : '等間隔'} {settings.fontSize}pt</div>
        </div>
      </div>

      {/* プレビューコンテナ */}
      <div className="border border-gray-300 bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
        <div className="flex justify-center">
          {/* ページ */}
          <div
            className="bg-white shadow-lg relative border border-gray-300"
            style={{
              width: `${previewWidth}px`,
              height: `${previewHeight}px`,
              minWidth: `${previewWidth}px`,
              minHeight: `${previewHeight}px`,
            }}
          >
            {/* 余白ガイド */}
            <div
              className="absolute border border-dashed border-gray-300"
              style={{
                top: `${marginTopPx}px`,
                left: `${marginLeftPx}px`,
                width: `${textAreaWidth}px`,
                height: `${textAreaHeight}px`,
              }}
            />

            {/* テキスト領域 */}
            <div
              className="absolute overflow-hidden"
              style={{
                top: `${marginTopPx}px`,
                left: `${marginLeftPx}px`,
                width: `${textAreaWidth}px`,
                height: `${textAreaHeight}px`,
              }}
            >
              {/* タイトル */}
              {settings.title && (
                <div
                  className={`mb-4 font-bold text-center ${
                    settings.writingMode === 'vertical' ? 'writing-vertical' : 'writing-horizontal'
                  }`}
                  style={{
                    fontFamily,
                    fontSize: `${fontSize * 1.2}px`,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  {settings.title}
                </div>
              )}

              {/* 著者名 */}
              {settings.author && (
                <div
                  className={`mb-6 text-center ${
                    settings.writingMode === 'vertical' ? 'writing-vertical' : 'writing-horizontal'
                  }`}
                  style={{
                    fontFamily,
                    fontSize: `${fontSize}px`,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  {settings.author}
                </div>
              )}

              {/* 本文 - CSS column-count使用 */}
              <div
                className={`${
                  settings.writingMode === 'vertical' ? 'writing-vertical' : 'writing-horizontal'
                }`}
                style={{
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: settings.lineHeight,
                  columnCount: settings.columns > 1 ? settings.columns : undefined,
                  columnGap: settings.columns > 1 ? `${settings.columnGap * scale * 3.78}px` : undefined,
                  columnFill: settings.columns > 1 ? 'balance' : undefined,
                }}
              >
                {paragraphs.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="mb-4 break-words"
                    style={{
                      textIndent: settings.writingMode === 'horizontal' ? '1em' : '0',
                      breakInside: 'avoid-column',
                    }}
                  >
                    {paragraph.split('\n').map((line, lineIndex) => (
                      <span 
                        key={lineIndex}
                        dangerouslySetInnerHTML={{ __html: processSimpleTateChuYoko(line) }}
                      />
                    )).reduce((acc, curr, index) => {
                      if (index > 0) acc.push(<br key={`br-${index}`} />)
                      acc.push(curr)
                      return acc
                    }, [] as React.ReactNode[])}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* プレビュー注意事項 */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          ※ このプレビューは参考表示です。実際のPDFとは表示が異なる場合があります。
        </p>
      </div>
    </div>
  )
}