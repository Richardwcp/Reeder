import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let cachedDb: any = null

export const connectToDatabase = async () => {
  if (cachedDb) {
    console.log('Using existing connection')
    return cachedDb
  }

  if (!client.isConnected()) {
    await client.connect()
  }

  cachedDb = client.db()
  console.log('New DB Connection')
  return cachedDb
}
