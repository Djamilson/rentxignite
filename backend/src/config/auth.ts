export default {
  jwt: {
    secretToken: process.env.APP_SECRET_TOKEN || 'default',
    secretRefreshToken: process.env.APP_SECRET_REFRESH_TOKEN || 'default',
    expiresInToken: '15m',
    expiresInRefreshToken: '30d',
    expiresRefreshTokenDays: 30,
  },
};
