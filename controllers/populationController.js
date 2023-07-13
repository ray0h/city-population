import { populations } from "../popdata.js"
import { compareStrings } from "../utils/compareStrings.js"

export const getPopulation = (req, reply, opt) => {
  console.log(opt)
  const city = req.params.city
  const state = req.params.state
  let record = populations.find(record => compareStrings(record.state, state) && compareStrings(record.city, city))
  if (record) {
    reply.status(200)
    reply.send({state: record.state, city: record.city, population: record.population})
  } else {
    reply.status(400)
    reply.send({error: "The city and/or state could not be found."})
  }
}

export const addOrUpdateCity = (req, reply) => {
  const city = req.params.city
  const state = req.params.state
  let record = populations.find(record => compareStrings(record.state, state) && compareStrings(record.city, city))
  
  if (record) {
    reply.status(200)
    record.population = String(req.body)
    reply.send({message: `${record.city}, ${record.state} record updated.`})
  } else {
    try {
      const new_city = {"city": city, "state": state, "population": String(req.body)}
      populations.push(new_city)
      reply.send({message: `${city}, ${state} added to records.`})
    } catch (err) {
      reply.status(400)
      reply.send({error: err})
    }
  }
}
