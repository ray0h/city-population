import Fastify from "fastify"
import * as fastifyMongodb from "@fastify/mongodb"
import populationRoutes from "./routes/populationRoutes.js"
import { PORT, LOCAL_MONGODB_PORT, mongoUrl } from "./utils/config.js"
import { testLocalClient } from "./utils/getMongoDBUrl.js";

const localMongoUrl = `mongodb://127.0.0.1:${LOCAL_MONGODB_PORT || 27017}/city-population`

const start_server = async () => {
  const app = Fastify({logger : true})
  // see if local mongoDB client is running; else fall back to the remote cluster url
  const isLocalMongoDBAvailable = await testLocalClient()
  const chosenMongoUrl = isLocalMongoDBAvailable ? localMongoUrl : mongoUrl
  
  try {
    app.register(fastifyMongodb, {
      forceClose: true,
      url: chosenMongoUrl
    })
    app.register(populationRoutes, {prefix: "api/population"})
    // Run the server:
    app.listen({ port: PORT || 5555 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start_server()