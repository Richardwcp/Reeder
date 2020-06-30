import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@utils/mongodb.utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = await connectToDatabase()
    const { _id: categoryId } = await db
      .collection('category')
      .findOne({ name: 'Home' })

    console.log('categoryId', categoryId)

    const feeds = await db
      .collection('rss_feed')
      .find({ category: categoryId })
      .toArray()

    res.status(200).json({ feeds })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
