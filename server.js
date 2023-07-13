import Fastify from "fastify";
const app = Fastify({logger : true})

// Create first route
app.get("/", async function handler (_req, resp) {
  resp.status(203)
  return {hello: "world"}
});

// Run the server:
try {
  await app.listen({ port: 5555 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
