import { getPopulation, addOrUpdateCity } from "../controllers/populationController.js"

export default function populationRoutes (app, options, done) {
  app.route({
    method: "GET",
    url: "/api/population/state/:state/city/:city",
    handler: getPopulation,
  })

  app.route({
    method: "PUT",
    url: "/api/population/state/:state/city/:city", 
    schema: {
      querystring: {
        state: {type: 'string'},
        city: {type: 'string'},
      },
      body: {type: 'integer'},
    },
    handler: addOrUpdateCity,
  })
  done()
}
