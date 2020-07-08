import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import database from '@middleware/database'
import { Db } from 'mongodb'

const handler = nextConnect()
handler.use(database)

interface CustomApiRequest extends NextApiRequest {
  db: Db
}

type Data = {
  success: boolean
  message: string
}

export default handler.post(
  async (req: CustomApiRequest, res: NextApiResponse<Data | string>) => {
    const { author, feedName, feedUrl, category } = req.body

    try {
      const { _id: categoryId } = await req.db
        .collection('category')
        .findOne({ name: category })

      await req.db.collection('rss_feed').insertOne({
        name: feedName,
        url: feedUrl,
        author: author,
        category_id: categoryId,
        lastUpdatedAt: null,
      })

      return res.status(200).json({ success: true, message: 'Feed created' })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      })
    }
  }
)
