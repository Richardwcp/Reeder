import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@utils/database'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let dbo = await connectToDatabase()

    dbo.createCollection('customers7', function (err, res) {
      if (err) throw err
      console.log('Collection created!')
    })

    res.status(200).send('test')
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
