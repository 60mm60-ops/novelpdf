module.exports = {
  apps: [
    {
      name: 'novel-manuscript-tool',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      // PDF生成用のメモリ制限を増加
      max_memory_restart: '1G',
      // プロセス終了時の猶予時間
      kill_timeout: 5000
    }
  ]
}