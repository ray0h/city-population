import { createReadStream } from "fs"
import csvParser from "csv-parser"
import { MongoClient } from "mongodb"
import { LOCAL_MONGODB_PORT } from "./config.js"

export const loadLocalData = async () => {
  const mongoClient = new MongoClient(`mongodb://localhost:${LOCAL_MONGODB_PORT || 27017}`, { useUnifiedTopology: true })
  
  const path = "./data/city_populations.csv"

  let parsed_data = []
  createReadStream(path)
    .pipe(csvParser())
    .on("data", async (csvrow) => {
      const { city, state, population } = csvrow
      const newrow = {"city": city, "state": state, "population": parseInt(population)}
      parsed_data.push(newrow)
    })
    .on("end", async () => {
      await mongoClient.connect()
      console.log(`local mongoDB connection established on port ${LOCAL_MONGODB_PORT || 27017}...`)
      const db = mongoClient.db("city-population")
      const populations = db.collection("populations")
      populations.deleteMany() // delete existing documents
      try {
        await populations.insertMany(parsed_data) 
        console.log("csv data loaded successfully")
      } catch (error) {
        console.error('Error inserting data:', error);
      } 
      await mongoClient.close()
      console.log("mongoDB connection closed")
    })
}