'use client'

import { ManuscriptSettings } from '@/types'
import { FileText, Download, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface GenerationPanelProps {
  settings: ManuscriptSettings
  isGenerating?: boolean
  setIsGenerating?: (generating: boolean) => void
}

interface GenerationResult {
  success: boolean
  downloadUrl?: string
  error?: string
  filename?: string
  fileSize?: number
  pageCount?: number
}

function GenerationPanel({ 
  settings, 
  isGenerating: externalIsGenerating, 
  setIsGenerating: externalSetIsGenerating 
}: GenerationPanelProps) {
  const [internalIsGenerating, setInternalIsGenerating] = useState(false)
  
  // 外部のstateが提供されている場合はそれを使用、なければ内部のstateを使用
  const isGenerating = externalIsGenerating !== undefined ? externalIsGenerating : internalIsGenerating
  const setIsGenerating = externalSetIsGenerating || setInternalIsGenerating
  const [result, setResult] = useState<GenerationResult | null>(null)

  const handleGeneratePdf = async () => {
    if (!settings.content.trim()) {
      setResult({
        success: false,
        error: '本文を入力してください。'
      })
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings,
          outputFilename: `${settings.title || '小説原稿'}_${Date.now()}.pdf`
        }),
      })

      const result = await response.json()
      setResult(result)

      // 成功時は自動ダウンロード
      if (result.success && result.downloadUrl) {
        const link = document.createElement('a')
        link.href = result.downloadUrl
        link.download = result.filename || 'manuscript.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('PDF生成エラー:', error)
      setResult({
        success: false,
        error: 'PDF生成中にエラーが発生しました。'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const canGenerate = settings.content.trim().length > 0

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">PDF生成</h2>
      </div>

      {/* 生成ボタン */}
      <div>
        <button
          onClick={handleGeneratePdf}
          disabled={isGenerating || !canGenerate}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            isGenerating || !canGenerate
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              PDF生成中...
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>PDFを生成</span>
            </div>
          )}
        </button>

        {!canGenerate && (
          <p className="text-sm text-red-500 mt-2 text-center">
            本文を入力してください
          </p>
        )}
      </div>

      {/* 生成結果 */}
      {result && (
        <div className={`p-4 rounded-lg ${
          result.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {result.success ? (
            <div>
              <h4 className="font-medium text-green-800 mb-2 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>PDF生成完了</span>
              </h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>ファイル名: {result.filename}</p>
                {result.fileSize && (
                  <p>ファイルサイズ: {(result.fileSize / 1024).toFixed(1)} KB</p>
                )}
                {result.pageCount && (
                  <p>ページ数: {result.pageCount}</p>
                )}
                <p className="text-xs text-green-600 mt-2">
                  ダウンロードが自動的に開始されます
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-medium text-red-800 mb-2 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>PDF生成エラー</span>
              </h4>
              <p className="text-sm text-red-700">
                {result.error || '不明なエラーが発生しました'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 使用方法 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>使用方法</span>
        </h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>1. 左側のフォームで原稿情報とレイアウトを設定</p>
          <p>2. 中央のプレビューで仕上がりを確認</p>
          <p>3. こちらのパネルでPDFを生成・ダウンロード</p>
        </div>
      </div>

      {/* 生成されるPDFの特徴 */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-medium text-orange-900 mb-2">💡 生成されるPDFの特徴</h3>
        <div className="text-xs text-orange-800 space-y-1">
          <p>• 印刷所規定に準拠したフォーマット</p>
          <p>• 日本語縦書き・横書き完全対応</p>
          <p>• CMYK/RGB/グレースケール対応</p>
          <p>• トンボ・塗り足し設定可能</p>
          <p>• 段組みレイアウト自動調整</p>
          <p>• プレビューと完全一致の出力</p>
        </div>
      </div>

      {/* 注意事項 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">注意事項</h3>
        <div className="text-xs text-gray-700 space-y-1">
          <p>• 生成されるPDFは印刷所の入稿規定に準拠しています</p>
          <p>• 大容量の原稿の場合、生成に時間がかかる場合があります</p>
          <p>• 生成されたPDFは一定時間後に自動削除されます</p>
        </div>
      </div>
    </div>
  )
}

export default GenerationPanel