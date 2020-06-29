import { MongoClient } from 'mongodb'

const MONGODB_URI =
  'mongodb+srv://admin:wecodeplus@reeder-i7l88.mongodb.net/<dbname>?retryWrites=true&w=majority'
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
      let db = client.db('reeder_db')
      console.log('New DB Connection')
      cachedDb = db
      return cachedDb
    })
    .catch(error => {
      console.log('Mongo connect Error')
      console.log(error)
    })
}
