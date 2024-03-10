const conf = {
  serverPort: Number(process.env.PORT),
  mongoURI: String(process.env.MONGO_URI),
  redisHost: String(process.env.REDIS_HOST),
  redisPort: Number(process.env.REDIS_PORT),
  redisUsername: String(process.env.REDIS_USERNAME),
  redisPassword: String(process.env.REDIS_PASSWORD),
};

export default conf;
