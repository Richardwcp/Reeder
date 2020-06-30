import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@utils/mongodb.utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = await connectToDatabase()
    const posts = await db.collection('posts').find({}).toArray()

    res.status(200).json(posts)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
