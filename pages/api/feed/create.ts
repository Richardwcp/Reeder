import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@utils/mongodb.utils'

type Data = {
  success: boolean
  msg: string
}
export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | string>
) => {
  if ('POST' === req.method) {
    const { author, feedName, feedUrl, category } = req.body

    try {
      const db = await connectToDatabase()

      const { insertedId: authorId } = await db.collection('author').insertOne({
        name: author,
      })

      const { _id: categoryId } = await db
        .collection('category')
        .findOne({ name: category })

      await db.collection('rss_feed').insertOne({
        name: feedName,
        url: feedUrl,
        author: authorId,
        category: categoryId,
      })

      res.status(200).json({ success: true, msg: 'Feed created' })
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: 'Something went wrong, please try again.',
      })
    }
  }

  res.status(404).send('404 Not Found')
}
