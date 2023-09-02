const env = (key: string, defaultVal: any = undefined) => {
  return process.env[key] || defaultVal;
};

env.require = (key: string, defaultVal: any = undefined) => {
  const value = process.env[key] || defaultVal;
  if (!value) {
    throw new Error(`Environment variable '${key}' is missing!`);
  }

  return value;
};

export default () => ({
  environment: env.require('NODE_ENV', 'development'),
  app: {
    name: env('APP_NAME', 'API'),
    port: parseInt(env('APP_PORT', 3000)),
    hostname: env('APP_HOSTNAME', '0.0.0.0'),
    host: env(
      'APP_HOST',
      `http://localhost:${parseInt(env('APP_PORT', 3000))}`,
    ),
    api: {
      version: env('APP_API_VERSION'),
    },
    clientUrl: env('APP_CLIENT_URL'),
  },
  db: {
    url: env.require('DATABASE_URL'),
  },
  redis: {
    host: env.require('REDIS_HOST', 'localhost'),
    port: parseInt(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD'),
    cacheTtl: parseInt(env.require('CACHE_TTL', '0')),
  },
  jwt: {
    secret: env.require('JWT_SECRET'),
    signOptions: {
      expiresIn: parseInt(env('JWT_EXPIRES', 30 * 60)),
    },
    refreshTokenExpiresIn: parseInt(
      env(
        'JWT_REFRESH_TOKEN_EXPIRES',
        6 * 60 * 60, // 6 hrs
      ),
    ),
  },
  smtp: {
    transport: {
      host: env.require('SMTP_HOST'),
      port: Number(env('SMTP_PORT', 587)),
      secure: env.require('SMTP_SECURE') === 'true',
      auth: {
        user: env('SMTP_USER'),
        pass: env('SMTP_PASSWORD'),
      },
    },
    defaults: {
      from: {
        name: env.require('EMAIL_SENDER_NAME'),
        address: env.require('EMAIL_SENDER_ADDRESS'),
      },
    },
  },
  swagger: {
    title: env('APP_NAME', 'API'),
    description: env('SWAGGER_DESCRIPTION', 'API description'),
    version: env('APP_API_VERSION'),
  },
});
