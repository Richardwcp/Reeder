import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
let cachedDb: any = null

export const connectToDatabase = async () => {
  if (cachedDb) {
    console.log('Using existing connection')
    return Promise.resolve(cachedDb)
  }

  return MongoClient.connect(MONGODB_URI, {
    native_parser: true,
    useUnifiedTopology: true,
  })
    .then(client => {
      let db = client.db()
      console.log('New DB Connection')
      cachedDb = db
      return cachedDb
    })
    .catch(error => {
      console.log('Mongo connect Error')
      console.log(error)
    })
}
