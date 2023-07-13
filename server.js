import Fastify from "fastify";
import populationRoutes from "./routes/populationRoutes.js"
const app = Fastify({logger : true})
const PORT = 5555

app.register(populationRoutes)

// Run the server:
app.listen({ port: PORT }, err => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
