const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);
client.get = util.promisify(client.get); // returns a promise
client.hget = util.promisify(client.hget); // Hash Get for nested cache

const exec = mongoose.Query.prototype.exec;

// Generalize caching logic using prototype applicable for each
// Query instance
mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || ''); // in case key is not provided
  return this;
}

mongoose.Query.prototype.exec = async function() {
  // console.log('Mongoose Query Prototype HOOK');
  if(!this.useCache) {
    console.log('Not Cached');
    const result = await exec.apply(this, arguments);
    return result;
  }
  const key = JSON.stringify(
    Object.assign({}, 
      this.getQuery(), 
      { collection: this.mongooseCollection.name }));

  // check if KEY exists in Redis
  // const cacheValue = await client.get(key);
  const cacheValue = await client.hget(this.hashKey, key);

  // If YES return cached value
  if(cacheValue) {
    console.log(' SERVING CacheValue');

    const doc = JSON.parse(cacheValue);
    // If it is an array need additional code
    const result = Array.isArray(doc) 
      ? doc.map( d => new this.model(d)) 
      : new this.model(doc);

    // Check if array or single object
    // const doc = new this.model(JSON.parse(cacheValue)); // single object
    return result;
  }

  // Otherwise issue Query and return the result, STORE the result
  const result = await exec.apply(this, arguments);
  // client.set(key, JSON.stringify(result));
  client.hset(this.hashKey, key, JSON.stringify(result));
  return result;
};

module.exports = {
  clearHash(hashKey) {
    console.log('Clearing Cache for: ', hashKey);
    client.del(JSON.stringify(hashKey));
  }
}