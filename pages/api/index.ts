import { NextApiRequest, NextApiResponse } from 'next'
import { client, q } from '@utils/fauna-client.utils'
import { connectToDatabase } from '@utils/database'

// const secret = process.env.FAUNADB_SECRET_KEY
// const client: Client = new faunadb.Client({ secret })

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
