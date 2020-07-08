import { connectToDatabase } from '@utils/mongodb.utils'
import nextConnect from 'next-connect'

async function database(req, res, next) {
  req.db = await connectToDatabase()
  return next()
}

const middleware = nextConnect()

middleware.use(database)

export default middleware
