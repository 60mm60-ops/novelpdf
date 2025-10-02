# 小説入稿ツール - Google Cloud Run デプロイガイド

## 概要
縦中横機能付き小説入稿ツールをGoogle Cloud Runにデプロイするための手順書です。

## 主な機能
- ✅ Next.js + TypeScript
- ✅ Playwright による PDF 生成
- ✅ 縦中横機能（1-2桁数字の横表示）
- ✅ 複数段組レイアウト
- ✅ 縦書き・横書き対応
- ✅ Google Fonts 日本語フォント対応

## 前提条件

### 1. Google Cloud SDK のセットアップ
```bash
# Google Cloud SDK インストール（未インストールの場合）
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# ログイン
gcloud auth login

# プロジェクト作成または選択
gcloud projects create YOUR_PROJECT_ID
gcloud config set project YOUR_PROJECT_ID

# 必要なAPIを有効化
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. 課金アカウント設定
Google Cloud Console で課金アカウントを設定してください。

## デプロイ手順

### 1. 環境変数設定
```bash
export GOOGLE_CLOUD_PROJECT="your-project-id"
```

### 2. 自動デプロイ（推奏）
```bash
# プロジェクトルートで実行
npm run gcp:deploy
```

### 3. 手動デプロイ（詳細制御が必要な場合）
```bash
# Step 1: Cloud Build でビルド
gcloud builds submit --config cloudbuild.yaml

# Step 2: デプロイ済みサービスの確認
gcloud run services list --platform managed

# Step 3: サービスURL取得
gcloud run services describe novel-manuscript-tool \
  --platform managed \
  --region asia-northeast1 \
  --format 'value(status.url)'
```

## ローカルテスト

### Docker でのテスト
```bash
# Docker イメージビルド & テスト
npm run docker:test

# 個別実行
docker build -t novel-manuscript-tool .
docker run -p 3000:3000 --rm novel-manuscript-tool
```

### 開発環境での動作確認
```bash
npm install
npm run dev
```

## 設定のカスタマイズ

### リソース設定
`cloudbuild.yaml` の以下の項目を環境に応じて調整：

```yaml
args: [
  '--memory', '2Gi',      # メモリ: 1Gi, 2Gi, 4Gi
  '--cpu', '2',           # CPU: 1, 2, 4
  '--timeout', '900',     # タイムアウト秒数
  '--concurrency', '10',  # 同時接続数
  '--max-instances', '5', # 最大インスタンス数
]
```

### リージョン変更
```yaml
'--region', 'asia-northeast1',  # 他: us-central1, europe-west1
```

## トラブルシューティング

### よくある問題

#### 1. ビルドタイムアウト
```bash
# cloudbuild.yaml の timeout を増加
timeout: 2400s  # 40分
```

#### 2. メモリ不足
```bash
# Cloud Run のメモリを増加
'--memory', '4Gi'
```

#### 3. Playwright ブラウザ起動失敗
Cloud Run では自動で Alpine Linux + Chromium を使用するため、通常は問題ありません。

#### 4. 日本語フォント表示問題
Dockerfile で `font-noto-cjk` パッケージがインストールされているか確認。

### ログ確認
```bash
# Cloud Run サービスのログ確認
gcloud logs read --service novel-manuscript-tool --platform managed

# 最新ログのリアルタイム表示
gcloud logs tail --service novel-manuscript-tool --platform managed
```

### デバッグ
```bash
# Cloud Build のビルドログ確認
gcloud builds list
gcloud builds log BUILD_ID
```

## セキュリティ考慮事項

### 1. IAM 設定
```bash
# Cloud Run Invoker ロールが必要（--allow-unauthenticated で回避可能）
gcloud run services add-iam-policy-binding novel-manuscript-tool \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region=asia-northeast1
```

### 2. 環境変数（機密情報）
Secret Manager を使用することを推奨：
```bash
# Secret 作成例
gcloud secrets create app-secrets --data-file=secrets.json

# Cloud Run で Secret 使用
gcloud run deploy novel-manuscript-tool \
  --set-env-vars="SECRET_KEY=projects/PROJECT_ID/secrets/app-secrets/versions/latest"
```

## コスト最適化

### 1. Cloud Run 料金
- CPU: 使用時間に応じて課金
- メモリ: 使用時間に応じて課金
- リクエスト数: 最初の200万リクエスト無料

### 2. Container Registry 料金
- ストレージ: イメージサイズに応じて課金
- ネットワーク: データ転送量に応じて課金

### 3. 最適化のヒント
```yaml
# インスタンス数を制限
'--max-instances', '3'

# コンカレンシーを調整
'--concurrency', '20'

# 不要なパッケージを削除
RUN apk del build-dependencies
```

## 更新とメンテナンス

### コードの更新
```bash
# 変更をコミット後
git add .
git commit -m "Update: feature description"

# 再デプロイ
npm run gcp:deploy
```

### 依存関係の更新
```bash
# パッケージ更新
npm update

# セキュリティ脆弱性チェック
npm audit fix
```

## サポート

### 参考リンク
- [Google Cloud Run ドキュメント](https://cloud.google.com/run/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Playwright Docker](https://playwright.dev/docs/docker)

### 開発チーム連絡先
問題が発生した場合は、開発チームまでご連絡ください。