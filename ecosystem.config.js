module.exports = {
  apps: [
    {
      name: 'admin',
      cwd: './apps/admin',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
    }
  ],
};



