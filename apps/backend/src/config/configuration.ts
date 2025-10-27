export default () => ({
  // 應用程式設定
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  },

  // 資料庫設定
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true',
  },

  // JWT 設定
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // MinIO / S3 設定
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT, 10) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
    bucket: process.env.MINIO_BUCKET || 'uploads',
  },

  // Email 設定（選配）
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },

  // LINE Notify 設定（選配）
  lineNotify: {
    token: process.env.LINE_NOTIFY_TOKEN,
  },
});

