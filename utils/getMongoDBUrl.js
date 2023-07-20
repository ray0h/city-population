import { MongoClient } from "mongodb"
import { LOCAL_MONGODB_PORT } from "./config.js"

const localMongoUrl = `mongodb://127.0.0.1:${LOCAL_MONGODB_PORT || 27017}/city-population`

export const testLocalClient = async () => {
  try {
    const localClient = new MongoClient(localMongoUrl, {useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 3000});
    await localClient.connect();
    localClient.close()
    return true
  } catch (_error) {
    return false
  }
}
