import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import { connectToDatabase } from '@utils/mongodb.utils'
import database from '@middleware/database'
import { Db } from 'mongodb'

const handler = nextConnect()
handler.use(database)

interface CustomApiRequest extends NextApiRequest {
  db: Db
}

export default handler.get(
  async (req: CustomApiRequest, res: NextApiResponse) => {
    try {
      const [categoryId] = await req.db.collection('category').distinct('_id', {
        name: 'Home',
      })
      console.log('categoryId', categoryId)

      const feeds = await req.db.collection('rss_feed').distinct('_id', {
        category_id: categoryId,
      })

      const posts = await req.db
        .collection('posts')
        .find({
          rss_feed_id: {
            $in: feeds,
          },
        })
        .sort({ pubDate: -1 })
        .toArray()

      res.status(200).json(posts)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
)
