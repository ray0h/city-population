// const app = require("fastify")({logger : true});
import Fastify from "fastify";
import populationRoutes from "./routes/populationRoutes.js"
const app = Fastify({logger : true})
const PORT = 5555

app.register(populationRoutes)

// Create first route
app.get("/hello", async function handler (_req, reply) {
  reply.send({hello: "world"})
});

// Run the server:
app.listen({ port: PORT }, err => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
