import Fastify from "fastify";
import * as fastifyMongodb from "@fastify/mongodb"
import populationRoutes from "./routes/populationRoutes.js"
import { PORT, mongoUrl } from "./utils/config.js"

const app = Fastify({logger : true})
// Register mongoDB plugin and routes
app.register(fastifyMongodb, {
  forceClose: true,
  url: mongoUrl
})
app.register(populationRoutes, {prefix: "api/population"})

// Run the server:
app.listen({ port: PORT || 5555 }, err => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
