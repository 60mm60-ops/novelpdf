#!/bin/bash

# 小説入稿ツール - Google Cloud Run デプロイスクリプト
# 使用方法: ./deploy-to-cloudrun.sh your-project-id

set -e

PROJECT_ID=${1:-""}

if [ -z "$PROJECT_ID" ]; then
    echo "❌ プロジェクトIDが指定されていません"
    echo "使用方法: ./deploy-to-cloudrun.sh your-project-id"
    exit 1
fi

echo "🚀 小説入稿ツールをGoogle Cloud Runにデプロイします"
echo "📋 プロジェクトID: $PROJECT_ID"
echo ""

# プロジェクト設定
echo "📝 Google Cloud プロジェクトを設定中..."
gcloud config set project $PROJECT_ID
export GOOGLE_CLOUD_PROJECT=$PROJECT_ID

# 必要なAPIを有効化
echo "🔧 必要なAPIを有効化中..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Cloud Buildでビルド・デプロイ
echo "🏗️ アプリケーションをビルド・デプロイ中..."
echo "   (この処理には5-10分程度かかります)"
gcloud builds submit --config cloudbuild.yaml

# デプロイ結果確認
echo ""
echo "✅ デプロイが完了しました！"
echo ""

# サービスURL取得
SERVICE_URL=$(gcloud run services describe novel-manuscript-tool \
  --platform managed \
  --region asia-northeast1 \
  --format 'value(status.url)')

echo "🌐 アプリケーションURL: $SERVICE_URL"
echo ""
echo "📋 次のステップ:"
echo "   1. ブラウザで上記URLにアクセス"
echo "   2. サンプル原稿でPDF生成をテスト"
echo "   3. 縦中横機能（1-2桁数字）を確認"
echo ""
echo "📊 監視コマンド:"
echo "   ログ確認: gcloud logs tail --service novel-manuscript-tool"
echo "   サービス詳細: gcloud run services describe novel-manuscript-tool --region asia-northeast1"
echo ""
echo "🎉 デプロイ完了！supervisor様にご報告いただけます。"