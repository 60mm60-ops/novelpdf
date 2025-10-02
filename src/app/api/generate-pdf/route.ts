import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'
import { PdfGenerationRequest, PdfGenerationResponse } from '@/types'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest): Promise<NextResponse<PdfGenerationResponse>> {
  let browser = null

  try {
    const body: PdfGenerationRequest = await request.json()
    const { settings, outputFilename } = body

    // バリデーション
    if (!settings.content?.trim()) {
      return NextResponse.json({
        success: false,
        error: '本文が入力されていません。'
      }, { status: 400 })
    }

    // PDFファイル保存先ディレクトリを作成
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs')
    await fs.mkdir(outputDir, { recursive: true })

    const filename = outputFilename || `manuscript_${Date.now()}.pdf`
    const outputPath = path.join(outputDir, filename)

    console.log('Starting PDF generation...')
    console.log('Output path:', outputPath)

    // Playwrightブラウザを起動
    browser = await chromium.launch({
      headless: true,
      timeout: 15000, // 15秒タイムアウト
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-background-networking',
        '--disable-features=TranslateUI'
      ]
    })

    const context = await browser.newContext()
    const page = await context.newPage()

    // ページサイズを設定
    const pageSize = getPageSizeInfo(settings.pageSize)
    const isLandscape = settings.orientation === 'landscape'

    // HTML コンテンツを生成
    const htmlContent = generateManuscriptHtml(settings)
    
    console.log('Setting page content...')
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    })

    // フォントの読み込み待機を短縮
    await page.waitForTimeout(1000)

    console.log('Generating PDF...')

    // PDF生成オプション
    const pdfOptions: any = {
      path: outputPath,
      format: settings.pageSize,
      landscape: isLandscape,
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: {
        top: `${settings.marginTop}mm`,
        right: `${settings.marginRight}mm`,
        bottom: `${settings.marginBottom}mm`,
        left: `${settings.marginLeft}mm`
      },
      pageRanges: '',  // 空白ページを防ぐ
    }

    // PDF生成
    await page.pdf(pdfOptions)

    console.log('PDF generated successfully')

    // ファイルサイズを取得
    const stats = await fs.stat(outputPath)
    const fileSize = stats.size

    // ページ数を概算（簡易計算）
    const estimatedPages = Math.ceil(settings.content.length / getCharsPerPage(settings))

    await browser.close()
    browser = null

    // 成功レスポンス
    return NextResponse.json({
      success: true,
      filename,
      downloadUrl: `/api/download/${filename}`,
      fileSize,
      pageCount: estimatedPages
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    
    if (browser) {
      await browser.close()
    }

    return NextResponse.json({
      success: false,
      error: `PDF生成中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`
    }, { status: 500 })
  }
}

// ページサイズ情報を取得
function getPageSizeInfo(pageSize: string) {
  const sizes: Record<string, { width: number; height: number }> = {
    'A4': { width: 210, height: 297 },
    'A5': { width: 148, height: 210 },
    'B5': { width: 182, height: 257 },
    'B6': { width: 128, height: 182 }
  }
  return sizes[pageSize] || sizes.A4
}

// 1ページあたりの文字数を概算
function getCharsPerPage(settings: any): number {
  const baseChars = settings.pageSize === 'A4' ? 1000 : 800
  const columnMultiplier = settings.columns === 1 ? 1 : settings.columns * 0.9
  return Math.floor(baseChars * columnMultiplier)
}

// 縦中横処理関数
function processSimpleTateChuYoko(text: string): string {
  return text.replace(/(?<!\d)\d{1,2}(?!\d)/g, '<span class="num-tcy">$&</span>');
}

// HTMLコンテンツを生成
function generateManuscriptHtml(settings: any): string {
  const pageSize = getPageSizeInfo(settings.pageSize)
  const isLandscape = settings.orientation === 'landscape'
  
  // ページサイズ（横向きの場合は幅と高さを入れ替え）
  const pageWidth = isLandscape ? pageSize.height : pageSize.width
  const pageHeight = isLandscape ? pageSize.width : pageSize.height

  // フォントファミリーの取得
  const getFontFamily = (fontType: string): string => {
    const fonts = {
      'mincho': '"Noto Serif JP", "Yu Mincho", "YuMincho", "Hiragino Mincho Pro", "ヒラギノ明朝 Pro W3", "メイリオ", serif',
      'gothic': '"Noto Sans JP", "Yu Gothic", "YuGothic", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "メイリオ", sans-serif',
      'mono': '"Noto Sans Mono", "Yu Gothic", "YuGothic", "Osaka-Mono", "MS Gothic", monospace'
    }
    return fonts[fontType as keyof typeof fonts] || fonts.mincho
  }

  // 段落を分割
  const paragraphs = settings.content.split('\n\n').filter((p: string) => p.trim())

  // 段組みコンテンツの生成
  const generateColumnContent = () => {
    // CSS column-countを使用する場合は全ての段落を連続して配置
    return paragraphs.map((paragraph: string, index: number) => {
      // 縦中横処理を適用
      const processedParagraph = processSimpleTateChuYoko(paragraph.replace(/\n/g, '<br>'));
      return `<p class="paragraph">${processedParagraph}</p>`;
    }).join('')
  }

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${settings.title || '原稿'}</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400;500;600;700;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <style>
    @page {
      size: ${pageWidth}mm ${pageHeight}mm;
      margin: ${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm;
      
      ${settings.cropMarks ? `
        marks: crop cross;
        bleed: ${settings.bleed}mm;
      ` : ''}
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${getFontFamily(settings.fontFamily)};
      font-size: ${settings.fontSize}pt;
      line-height: ${settings.lineHeight};
      color: #000;
      background: white;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      
      ${settings.writingMode === 'vertical' ? `
        writing-mode: vertical-rl;
        text-orientation: mixed;
      ` : `
        writing-mode: horizontal-tb;
      `}
      
      ${settings.colorMode === 'Grayscale' ? 'filter: grayscale(100%);' : ''}
    }
    
    .manuscript-container {
      width: 100%;
      min-height: 100vh;
      max-height: 100vh;
      display: block;
      padding: 0;
      overflow: hidden;
      page-break-after: auto;
    }
    
    .title {
      font-size: ${settings.fontSize * 1.4}pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: ${settings.fontSize * 2}pt;
      ${settings.writingMode === 'vertical' ? 'writing-mode: vertical-rl;' : ''}
    }
    
    .author {
      font-size: ${settings.fontSize * 1.1}pt;
      text-align: center;
      margin-bottom: ${settings.fontSize * 3}pt;
      ${settings.writingMode === 'vertical' ? 'writing-mode: vertical-rl;' : ''}
    }
    
    .content {
      ${settings.columns > 1 ? `
        column-count: ${settings.columns};
        column-gap: ${settings.columnGap}mm;
        column-fill: balance;
        column-rule: none;
      ` : ''}
      ${settings.writingMode === 'vertical' ? 'writing-mode: vertical-rl;' : ''}
      page-break-inside: avoid;
      overflow: visible;
    }
    
    .column {
      width: 100%;
      break-inside: avoid-column;
    }
    
    .paragraph {
      margin-bottom: ${settings.fontSize * 1.2}pt;
      ${settings.writingMode === 'horizontal' ? 'text-indent: 1em;' : ''}
      word-wrap: break-word;
      overflow-wrap: break-word;
      break-inside: avoid-column;
      page-break-inside: avoid;
      orphans: 2;
      widows: 2;
    }
    
    /* 縦中横のスタイル */
    .num-tcy {
      text-combine-upright: all !important;
      -webkit-text-combine: horizontal !important;
      -ms-text-combine-horizontal: all !important;
      text-orientation: upright !important;
      font-feature-settings: "tnum" !important;
      display: inline-block !important;
    }
    
    /* 縦書きの場合の特別な設定 */
    ${settings.writingMode === 'vertical' ? `
      .num-tcy {
        writing-mode: horizontal-tb;
        text-orientation: mixed;
        display: inline-block;
        width: 1em;
        height: 1em;
        text-align: center;
        vertical-align: middle;
      }
    ` : ''}
    
    /* 縦書き時の句読点調整 */
    ${settings.writingMode === 'vertical' ? `
      .paragraph {
        text-combine-upright: none;
      }
      
      /* 小書き文字の調整 */
      .paragraph::before {
        content: "";
      }
    ` : ''}
    
    /* 印刷時の調整 */
    @media print {
      * {
        page-break-after: auto;
        page-break-before: auto;
        page-break-inside: auto;
      }
      
      body {
        ${settings.colorMode === 'CMYK' ? `
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        ` : ''}
      }
      
      .manuscript-container {
        page-break-after: auto;
        height: auto;
        min-height: auto;
        max-height: none;
      }
      
      .content {
        page-break-after: auto;
        height: auto;
      }
      
      .paragraph {
        orphans: 2;
        widows: 2;
        page-break-inside: avoid;
      }
      
      .title, .author {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="manuscript-container">
    ${settings.title ? `<h1 class="title">${settings.title}</h1>` : ''}
    ${settings.author ? `<div class="author">${settings.author}</div>` : ''}
    
    <div class="content">
      ${generateColumnContent()}
    </div>
  </div>
</body>
</html>`

  return html
}