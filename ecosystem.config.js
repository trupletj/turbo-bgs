module.exports = {
  apps: [
   {
      name: 'admin',
      cwd: './apps/admin',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
        AUTH_SECRET: "X3taGLOxtyolIoOzD5j0yRKQKkssxYtIrCE2Xd12Hjs=",
        AUTH_TRUST_HOST: "true",
        DATABASE_URL: "postgresql://bteg:BTEG-sr2024@202.131.228.118:5432/turbo_bgs_db?schema=public"
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};



