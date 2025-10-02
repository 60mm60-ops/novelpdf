import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '小説入稿ツール - 印刷通販向けPDF生成',
  description: '日本語縦書き対応の小説入稿用PDF生成ツール。段組み、フォント選択、印刷所規定PDF自動生成機能を提供します。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-gothic">
        {children}
      </body>
    </html>
  )
}