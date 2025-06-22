module.exports = {
  apps: [
    {
      name: 'admin',
      cwd: './apps/admin',
      script: 'npm',
      args: 'start',

      // ----- COMMON -----
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      

      // ----- ENV: PROD -----
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000,
        HOST: '0.0.0.0',
        DATABASE_URL: process.env.DATABASE_URL, 
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_TRUSTED_HOST: true,
        AUTH_URL: process.env.AUTH_URL
      },

      instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
    },
  ],
};