import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@utils/database'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = await connectToDatabase()
    const customers = await db.collection('customers').find({}).toArray()

    res.status(200).json({ customers })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
