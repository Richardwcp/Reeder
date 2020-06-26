import { NextApiRequest, NextApiResponse } from 'next'
import { client, q } from '@utils/fauna-client.utils'

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
      const { ref: authorRef } = await client.query(
        q.Create(q.Collection('author'), { data: { name: author } })
      )

      const { ref: categoryRef } = await client.query(
        q.Get(q.Match(q.Index('category_by_name'), category))
      )

      await client.query(
        q.Create(q.Collection('rss_feed'), {
          data: {
            name: feedName,
            url: feedUrl,
            author: authorRef,
            category: categoryRef,
          },
        })
      )
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
