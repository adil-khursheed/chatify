const conf = {
  serverPort: Number(process.env.PORT),
  corsOrigin: String(process.env.CORS_ORIGIN),
  mongoURI: String(process.env.MONGO_URI),
  redisHost: String(process.env.REDIS_HOST),
  redisPort: Number(process.env.REDIS_PORT),
  redisUsername: String(process.env.REDIS_USERNAME),
  redisPassword: String(process.env.REDIS_PASSWORD),
  webhookSecret: String(process.env.WEBHOOK_SECRET),
};

export default conf;
