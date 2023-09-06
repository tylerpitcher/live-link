const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URI
});

async function getRedisKey(key) {
  return JSON.parse(await client.get(key));
}

async function setRedisKey(key, value) {
  return await client.setEx(
    key, process.env.EXPIRATION, JSON.stringify(value)
  );
}

async function updateRedisKey(key, value) {
  const ttl = await client.ttl(key);
  return await client.setEx(
    key, ttl, JSON.stringify(value)
  );
}

function delRedisKey(key) {
  return client.del(key);
}

client.connect();

module.exports = {
  getRedisKey,
  setRedisKey,
  updateRedisKey,
  delRedisKey
};
