import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@utils/mongodb.utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = await connectToDatabase()
    const [categoryId] = await db.collection('category').distinct('_id', {
      name: 'Home',
    })
    console.log('categoryId', categoryId)

    const feeds = await db.collection('rss_feed').distinct('_id', {
      category_id: categoryId,
    })

    const posts = await db
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
