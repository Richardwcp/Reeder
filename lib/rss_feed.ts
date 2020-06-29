import { client, q } from '@utils/fauna-client.utils'

async function getAllRssUrls(): Promise<string[]> {
  const { data } = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_rss_urls'))),
      q.Lambda('url', q.Var('url'))
    )
  )
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

async function getFeedByUrl(url: string) {
  const { ref } = await client.query(
    q.Get(q.Match(q.Index('feed_by_url'), url))
  )
  return ref
}

export { getAllRssUrls, getFeedByUrl }
