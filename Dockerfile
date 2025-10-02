FROM node:20-slim

# Playwrightの依存関係と日本語フォントをインストール
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    fonts-noto-cjk \
    fonts-noto-cjk-extra \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 依存関係をコピーしてインストール
COPY package*.json ./
RUN npm install

# Playwrightのブラウザをインストール
RUN npx playwright install --with-deps chromium

# アプリケーションコードをコピー
COPY . .

# ビルド
RUN npm run build

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
