const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

module.exports = (app) => {
    // Configure Redis client
    const redisClient = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASS
    });

    redisClient.on('error', (err) => {
        console.log(`Redis connection failed: ${err}`);
    });
    redisClient.on('connect', () => {
        console.log(`Connected to Redis database at '${process.env.REDIS_HOST}:${process.env.REDIS_PORT}'`);
    });

    // Conncet to Redis database
    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.REDIS_SECRET,
        resave: false,
        saveUninitialized: false,
    }));
};