'use client'

import { ManuscriptSettings } from '@/types'
import { cn } from '@/lib/utils'
import { 
  BookOpen, 
  Type, 
  Layout, 
  Palette, 
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'

interface ManuscriptFormProps {
  settings: ManuscriptSettings
  onChange: (settings: ManuscriptSettings) => void
  disabled?: boolean
}

function ManuscriptForm({ settings, onChange, disabled }: ManuscriptFormProps) {
  const handleChange = (key: keyof ManuscriptSettings, value: any) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">原稿設定</h2>
      </div>

      {/* 基本情報 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <Type className="h-4 w-4" />
          <span>基本情報</span>
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            作品タイトル
          </label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="作品のタイトルを入力"
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            著者名
          </label>
          <input
            type="text"
            value={settings.author}
            onChange={(e) => handleChange('author', e.target.value)}
            placeholder="著者名を入力"
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            本文
          </label>
          <textarea
            value={settings.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="小説の本文を入力してください&#10;&#10;段落は空行で区切られます。&#10;&#10;「台詞は鍵括弧で囲まれます」&#10;　地の文は全角スペースで字下げします。"
            rows={12}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 font-mincho resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            文字数: {settings.content.length}文字
          </p>
        </div>
      </div>

      {/* レイアウト設定 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <Layout className="h-4 w-4" />
          <span>レイアウト設定</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ページサイズ
            </label>
            <select
              value={settings.pageSize}
              onChange={(e) => handleChange('pageSize', e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            >
              <option value="A4">A4 (210×297mm)</option>
              <option value="A5">A5 (148×210mm)</option>
              <option value="B5">B5 (182×257mm)</option>
              <option value="B6">B6 (128×182mm)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              向き
            </label>
            <select
              value={settings.orientation}
              onChange={(e) => handleChange('orientation', e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            >
              <option value="portrait">縦向き</option>
              <option value="landscape">横向き</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            書字方向
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleChange('writingMode', 'vertical')}
              disabled={disabled}
              className={cn(
                'flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors',
                settings.writingMode === 'vertical'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              縦書き
            </button>
            <button
              type="button"
              onClick={() => handleChange('writingMode', 'horizontal')}
              disabled={disabled}
              className={cn(
                'flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors',
                settings.writingMode === 'horizontal'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              横書き
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            段組み
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3].map((cols) => (
              <button
                key={cols}
                type="button"
                onClick={() => handleChange('columns', cols)}
                disabled={disabled}
                className={cn(
                  'flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors',
                  settings.columns === cols
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {cols}段
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* フォント設定 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <Palette className="h-4 w-4" />
          <span>フォント設定</span>
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            フォント種類
          </label>
          <div className="space-y-2">
            {[
              { value: 'mincho', label: '明朝体', sample: '吾輩は猫である。名前はまだ無い。' },
              { value: 'gothic', label: 'ゴシック体', sample: '吾輩は猫である。名前はまだ無い。' },
              { value: 'mono', label: '等間隔', sample: '吾輩は猫である。名前はまだ無い。' }
            ].map(({ value, label, sample }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange('fontFamily', value)}
                disabled={disabled}
                className={cn(
                  'w-full p-3 rounded-md border text-left transition-colors',
                  settings.fontFamily === value
                    ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{label}</span>
                  <div className="w-3 h-3 rounded-full border-2 border-current" />
                </div>
                <div className={cn(
                  'text-sm mt-1',
                  value === 'mincho' && 'font-mincho',
                  value === 'gothic' && 'font-gothic',
                  value === 'mono' && 'font-mono'
                )}>
                  {sample}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              フォントサイズ (pt)
            </label>
            <input
              type="number"
              value={settings.fontSize}
              onChange={(e) => handleChange('fontSize', parseFloat(e.target.value))}
              step="0.5"
              min="6"
              max="72"
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              行間 (倍率)
            </label>
            <input
              type="number"
              value={settings.lineHeight}
              onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
              step="0.1"
              min="1.0"
              max="3.0"
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* 余白設定 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>余白設定 (mm)</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              上余白
            </label>
            <input
              type="number"
              value={settings.marginTop}
              onChange={(e) => handleChange('marginTop', parseInt(e.target.value))}
              min="0"
              max="50"
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              下余白
            </label>
            <input
              type="number"
              value={settings.marginBottom}
              onChange={(e) => handleChange('marginBottom', parseInt(e.target.value))}
              min="0"
              max="50"
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              左余白
            </label>
            <input
              type="number"
              value={settings.marginLeft}
              onChange={(e) => handleChange('marginLeft', parseInt(e.target.value))}
              min="0"
              max="50"
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              右余白
            </label>
            <input
              type="number"
              value={settings.marginRight}
              onChange={(e) => handleChange('marginRight', parseInt(e.target.value))}
              min="0"
              max="50"
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            段間余白 (mm)
          </label>
          <input
            type="number"
            value={settings.columnGap}
            onChange={(e) => handleChange('columnGap', parseInt(e.target.value))}
            min="0"
            max="20"
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
          />
        </div>
      </div>
    </div>
  )
}

export default ManuscriptForm