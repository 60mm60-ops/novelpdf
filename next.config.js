/** @type {import('next').NextConfig} */
const nextConfig = {
  // PDF生成のためのサーバーサイド処理を有効化
  serverExternalPackages: ['playwright'],
  
  // Cloud Run対応（Next.js 15.5では不要）
  
  // Standalone output for Docker
  output: 'standalone',
  
  // 画像最適化を無効化（必要に応じて）
  images: {
    unoptimized: true,
  },
  
  // 静的ファイルの設定
  trailingSlash: false,
  
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig