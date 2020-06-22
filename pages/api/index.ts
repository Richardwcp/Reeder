import { NextApiRequest, NextApiResponse } from 'next'
import { client, q } from '../utils/fauna-client'

// const secret = process.env.FAUNADB_SECRET_KEY
// const client: Client = new faunadb.Client({ secret })

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data } = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index('all_rss_urls'))),
        q.Lambda('url', q.Var('url'))
      )

      // q.Get(q.Ref(q.Collection('rss_feeds')))
      // q.Create(q.Collection('rss_feeds'), {
      //   data: {
      //     name: 'Home',
      //     url: 'http://feeds.skynews.com/feeds/rss/home.xml',
      //     author: q.Ref(q.Collection('author'), '268946160960406022'),
      //   },
      // })
      // q.Map(
      //   q.Paginate(
      //     q.Match(
      //       q.Index('feeds_by_author'),
      //       q.Ref(q.Collection('author'), '268946160960406022')
      //     )
      //   ),
      //   q.Lambda('x', q.Get(q.Var('x')))
      // )
    )

    // await client.query(
    //   q.Create(q.Collection('rss_feeds'), {
    //     data: {
    //       name: 'Home',
    //       url: 'http://feeds.skynews.com/feeds/rss/home.xml',
    //       author: q.Get(q.Ref(q.Collection('author'), '268946160960406022')),
    //     },
    //   })
    // )

    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
