import { NextApiRequest, NextApiResponse } from 'next'
import { client, q } from '@utils/fauna-client'

type Data = {
  success: boolean
  msg: string
}
export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | string>
) => {
  if ('POST' === req.method) {
    console.log(req.body)

    const { author, feedName, feedUrl, category } = req.body

    const authorRef = await client.query(
      q.Create(q.Collection('author'), { data: { name: author } })
    )

    const categoryRef = await client.query(
      q.Get(q.Match(q.Index('category_by_name'), category))
    )

    const { data } = await client.query(
      q.Create(q.Collection('rss_feed'), {
        data: {
          name: feedName,
          url: feedUrl,
          author: authorRef.ref,
          category: categoryRef.ref,
        },
      })
    )
    console.log('data', data)

    res.status(200).json({ success: true, msg: 'Feed created' })
  } else {
    res.status(404).send('Not found')
  }
}
