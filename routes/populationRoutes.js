import NodeCache from 'node-cache'

export default function populationRoutes (app, _options, done) {
  const populations = app.mongo.client.db("city-population").collection("populations")
  const cache = new NodeCache({ stdTTL: 60 })

  const getPopulation = async (req, reply) => {
    const city = req.params.city.toLowerCase()
    const state = req.params.state.toLowerCase()
    const query = {
      "city": {"$regex": city, "$options": "i"}, 
      "state": {"$regex": state, "$options": "i"}
    }
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

    try {
      const value = await populations.findOne(query, { population: 1 })
      if (value.population) {
        cache.set(cacheKey, value.population)
        reply.status(200).send({population: value.population})
      }
    } catch (error) {
        cache.set(cacheKey, "error")
        reply.status(400).send({error: "The city and/or state could not be found."})
    }
  }
  
  const addOrUpdateCity = async (req, reply) => {
    const city = req.params.city.toLowerCase()
    const state = req.params.state.toLowerCase()
    const population = parseInt(req.body)
    
    const cacheKey = `${city}_${state}_${population}`
    const cachedResponse = cache.get(cacheKey)
    if (cachedResponse !== undefined) {
      reply.status(200).send({status: "Record updated"})
      return
    }

    const query = {
      "city": {"$regex": city, "$options": "i"}, 
      "state": {"$regex": state, "$options": "i"}
    }

    try {
      const value = await populations.updateOne(query, {$set: {"population": population}}, {upsert: true})
      if (value.upsertedCount == 1) {
        cache.set(cacheKey, true)
        reply.status(201).send({status: "New record added"})
      } else {
        cache.set(cacheKey, true)
        cache.del(`${city}_${state}`) // invalidate possible GET request cache on update
        reply.status(200).send({status: "Record updated"})
      }
    } catch (error) {
        reply.status(400).send({error: `Unable to add record, error: ${error}.`})
    }
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
