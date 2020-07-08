import { MongoClient } from 'mongodb'
import nextConnect from 'next-connect'

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let cachedDb: any = null

async function database(req, res, next) {
  if (cachedDb) {
    req.db = cachedDb
    return next()
  }

  if (!client.isConnected()) {
    await client.connect()
  }

  cachedDb = client.db()
  req.db = cachedDb
  return next()
}

const middleware = nextConnect()

middleware.use(database)

export default middleware
