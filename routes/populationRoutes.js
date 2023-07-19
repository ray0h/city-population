import NodeCache from 'node-cache'

export default function populationRoutes (app, options, done) {
  const populations = app.mongo.client.db("city-population").collection("populations")
  const cache = new NodeCache({ stdTTL: 60 })

  const getPopulation = (req, reply) => {
    const city = req.params.city
    const state = req.params.state
    const cacheKey = `${city}_${state}`

    const cachedResponse = cache.get(cacheKey)
    if (cachedResponse !== undefined) {
      if (cachedResponse != "error") {
        reply.status(200).send({ population: cachedResponse })
        return
      } else {
        reply.status(400).send({error: "The city and/or state could not be found."})
        return
      }
    }
    const query = {"city": {"$regex": city, "$options": "i"}, "state": {"$regex": state, "$options": "i"}}
    populations.findOne(query, { population: 1 }).then(value => {
      if (value) {
        cache.set(cacheKey, value.population)
        reply.status(200).send({population: value.population})
      } else {
        cache.set(cacheKey, "error")
        reply.status(400).send({error: "The city and/or state could not be found."})
      }
    })
  }
  
  const addOrUpdateCity = (req, reply) => {
    const city = req.params.city
    const state = req.params.state
    const query = {"city": {"$regex": city, "$options": "i"}, "state": {"$regex": state, "$options": "i"}}
    
    populations.updateOne(query, {$set: {"population": String(req.body)}}).then(value => {
      if (value.modifiedCount == 1 || value.matchedCount == 1) {
        reply.status(200)
        reply.send({status: "Record updated"})
      } else if (value.matchedCount == 0) {
        const new_city = {"city": city, "state": state, "population": String(req.body)}
        populations.insertOne(new_city).then(value => {
          reply.status(201)
          reply.send({status: "New record added"})
        })
      } else {
        reply.status(400)
        reply.send({error: "Unable to add record."})
      }
    })
}

  app.route({
    method: "GET",
    url: "/state/:state/city/:city",
    handler: getPopulation,
  })

  app.route({
    method: "PUT",
    url: "/state/:state/city/:city", 
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
