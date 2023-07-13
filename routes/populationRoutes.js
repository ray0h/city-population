import populations from "../popdata.js"
import { compareStrings } from "../helpers/compareStrings.js"

export default function populationRoutes (app, options, done) {
  app.get("/api/population/state/:state/city/:city", (req, reply) => {
    const city = req.params.city
    const state = req.params.state
    let record = populations.find(record => compareStrings(record.state, state) && compareStrings(record.city, city))
    reply.send({state: record.state, city: record.city, population: record.population})
  })

  app.route({
    method: "PUT",
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
