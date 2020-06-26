import { NextApiRequest, NextApiResponse } from 'next'
import jsdom from 'jsdom'
import { client, q } from '@utils/fauna-client'
import { removeCDATA } from '@utils/remove-CDATA'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const authorName = 'BBC News'

  const rssUrls = await getRssFeedsByAuthorName(authorName)

  // const promises = rssUrls.map(async url => {
  //   const items = await extractRssContent(url)
  //   return await saveToDb(items)
  // })

  // try {
  //   await Promise.all(promises)
  //   res.status(200).send('BBC News posts saved to DB')
  // } catch (error) {
  //   console.error(error)
  //   res.status(500).send('Internal server error')
  // }

  const items = await extractRssContent('http://feeds.bbci.co.uk/news/rss.xml')

  res.status(200).json(items)
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

async function extractRssContent(url) {
  const { JSDOM } = jsdom
  const { window } = new JSDOM(``)

  const feedRef = await getFeedByUrl(url)
  const promise = await fetch(url)
  const str = await promise.text()

  const doc: Document = new window.DOMParser().parseFromString(str, 'text/xml')
  const nodeList = doc.querySelectorAll('item')

  let items = []
  nodeList.forEach(el => {
    const title = removeCDATA(el.querySelector('title').innerHTML)
    const description = removeCDATA(el.querySelector('description').innerHTML)
    const link = el.querySelector('link').innerHTML
    const date = el.querySelector('pubDate').innerHTML

    const item = {
      title,
      description,
      link,
      date,
      rss_feed: feedRef,
    }

    items.push(item)
  })

  return items
}

async function saveToDb(items: Array<any>) {
  try {
    await client.query(
      q.Map(
        items,
        q.Lambda(
          'post',
          q.Create(q.Collection('posts'), { data: q.Var('post') })
        )
      )
    )
  } catch (error) {
    console.error(error)
  }
}

async function getFeedByUrl(url: string) {
  const { ref } = await client.query(
    q.Get(q.Match(q.Index('feed_by_url'), url))
  )
  return ref
}
