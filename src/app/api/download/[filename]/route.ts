import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    // セキュリティチェック: ディレクトリトラバーサル攻撃を防ぐ
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: '不正なファイル名です。' },
        { status: 400 }
      )
    }

    // ファイルパス構築
    const filePath = path.join(process.cwd(), 'public', 'generated-pdfs', filename)

    // ファイル存在チェック
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません。' },
        { status: 404 }
      )
    }

    // ファイル読み込み
    const fileBuffer = fs.readFileSync(filePath)

    // レスポンスヘッダー設定
    const response = new NextResponse(fileBuffer)
    response.headers.set('Content-Type', 'application/pdf')
    response.headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
    response.headers.set('Content-Length', fileBuffer.length.toString())

    return response

  } catch (error) {
    console.error('ファイルダウンロードエラー:', error)
    return NextResponse.json(
      { error: 'ファイルダウンロード中にエラーが発生しました。' },
      { status: 500 }
    )
  }
}