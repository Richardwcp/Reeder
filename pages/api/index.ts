import { NextApiRequest, NextApiResponse } from 'next'
import faunadb, { Client, query as q } from 'faunadb'

const secret = process.env.FAUNADB_SECRET_KEY
const client: Client = new faunadb.Client({ secret })

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const ret = await client.query(
      q.Get(q.Ref(q.Collection('test'), '268672185403443719'))
    )

    res.status(200).json(ret)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
