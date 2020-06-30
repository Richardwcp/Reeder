import { client, q } from '@utils/fauna-client.utils'
import { connectToDatabase } from '@utils/mongodb.utils'

async function getAllRssUrls(): Promise<string[]> {
  const db = await connectToDatabase()
  const data = await db.collection('rss_feed').distinct('url')

  return data
}

async function getRssFeedsByAuthorName(name: string) {
  const { data } = await client.query(
    q.Map(
      q.Paginate(
        q.Join(
          q.Match(q.Index('author_by_name'), name),
          q.Index('feeds_by_author')
        )
      ),
      q.Lambda('ref', q.Get(q.Var('ref')))
    )
  )
  const rssUrls = data.map(({ data: { url } }) => {
    return url
  })

  return rssUrls
}

async function getFeedIdByUrl(url: string) {
  const db = await connectToDatabase()
  const { _id } = await db.collection('rss_feed').findOne({ url: url })

  return _id
}

export { getAllRssUrls, getFeedIdByUrl }
