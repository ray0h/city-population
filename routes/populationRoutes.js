import populations from "../popdata.js"

export default function populationRoutes (app, options, done) {
  app.get("/api/population/state/:state/city/:city", (req, reply) => {
    const city = req.params.city
    const state = req.params.state
    let record = populations.find(record => record.state == state && record.city == city)
    reply.send({state: req.params.state, city: req.params.city, population: record.population})
  })

  app.route({
    method: 'PUT',
    url: "/api/population/state/:state/city/:city", 
    schema: {
      querystring: {
        state: {type: 'string'},
        city: {type: 'string'},
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          state: { type: 'string'},
          city: { type: 'string'}
        }
      }
    },
    handler: (req, reply) => {reply.send({state: req.params.state, city: req.params.city})}
  
  })
  done()
}
