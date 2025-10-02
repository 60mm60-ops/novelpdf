'use client'

import { useState } from 'react'
import ManuscriptForm from '@/components/ManuscriptForm'
import { PreviewPanel } from '@/components/PreviewPanel'
import GenerationPanel from '@/components/GenerationPanel'
import { ManuscriptSettings } from '@/types'
import { BookOpen, Settings, FileText } from 'lucide-react'

const defaultSettings: ManuscriptSettings = {
  title: '',
  author: '',
  content: '',
  fontSize: 10.5,
  lineHeight: 1.8,
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 20,
  marginRight: 20,
  writingMode: 'vertical',
  fontFamily: 'mincho',
  columns: 1,
  columnGap: 10,
  pageSize: 'A4',
  orientation: 'portrait',
  bleed: 3,
  cropMarks: false,
  colorMode: 'CMYK'
}

export default function Home() {
  const [settings, setSettings] = useState<ManuscriptSettings>(defaultSettings)
  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'generate'>('form')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSettingsChange = (newSettings: ManuscriptSettings) => {
    setSettings(newSettings)
  }

  const tabs = [
    { id: 'form' as const, label: '原稿入力', icon: BookOpen },
    { id: 'preview' as const, label: 'プレビュー', icon: FileText },
    { id: 'generate' as const, label: 'PDF生成', icon: Settings }
  ]

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">小説入稿ツール</h1>
              <p className="text-gray-600">印刷通販向け PDF 生成システム</p>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="flex space-x-1 border-b border-gray-200">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                disabled={isGenerating}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左パネル - フォーム */}
          <div className={`lg:col-span-1 ${activeTab !== 'form' ? 'hidden lg:block' : ''}`}>
            <ManuscriptForm
              settings={settings}
              onChange={handleSettingsChange}
              disabled={isGenerating}
            />
          </div>

          {/* 中央パネル - プレビュー */}
          <div className={`lg:col-span-1 ${activeTab !== 'preview' ? 'hidden lg:block' : ''}`}>
            <PreviewPanel
              settings={settings}
            />
          </div>

          {/* 右パネル - 生成 */}
          <div className={`lg:col-span-1 ${activeTab !== 'generate' ? 'hidden lg:block' : ''}`}>
            <GenerationPanel
              settings={settings}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2024 小説入稿ツール - 日本語縦書き対応 PDF 生成システム</p>
        </div>
      </div>
    </div>
  )
}