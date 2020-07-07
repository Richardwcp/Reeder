import { MongoClient } from 'mongodb'
import nextConnect from 'next-connect'

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let cachedDb: any = null

async function database(req, res, next) {
  if (cachedDb) {
    console.log('Using existing connection')
    return next()
  }

  if (!client.isConnected()) {
    console.log('Connect...')
    await client.connect()
  }

  // req.dbClient = client
  cachedDb = client.db()
  console.log('New DB Connection')
  req.db = cachedDb
  return next()
}

const middleware = nextConnect()

middleware.use(database)

export default middleware
