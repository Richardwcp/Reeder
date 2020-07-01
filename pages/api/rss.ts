import { NextApiRequest, NextApiResponse } from 'next'
import jsdom from 'jsdom'
import { removeCdataFromString } from '@utils/sanitise-xml.utils'
import { getAllRssUrls, getFeedByUrl, updateRssFeed } from '@lib/rss_feed'
import { getTimestampFromDate } from '@utils/date.utils'
import { savePostsToDb } from '@lib/posts'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const rssUrls = await getAllRssUrls()

  const promises = rssUrls.map(async url => {
    const doc: Document = await createDocument(url)
    const { _id: feedId, lastUpdatedAt } = await getFeedByUrl(url)

    const lastBuildDate = getTimestampFromDate(
      doc.querySelector('lastBuildDate').textContent
    )

    if (!isUpdated(lastUpdatedAt, lastBuildDate)) {
      let posts = []
      const nodeList = doc.querySelectorAll('item')
      const item = extractPostFromNodeList(nodeList)
      const post = { ...item, rss_feed_id: feedId }
      posts.push(post)

      const filter = { _id: feedId }
      const update = { lastUpdatedAt: lastBuildDate }
      await updateRssFeed(filter, update)

      return await savePostsToDb(posts)
    }

    return Promise.resolve()
  })

  try {
    await Promise.all(promises)
    res.status(200).send('Saved')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
}

async function createDocument(url: string): Promise<Document> {
  const { JSDOM } = jsdom
  const { window } = new JSDOM(``)

  const promise = await fetch(url)
  const str = await promise.text()

  const doc: Document = new window.DOMParser().parseFromString(str, 'text/xml')

  return doc
}

function extractPostFromNodeList(nodeList) {
  let item = {}

  nodeList.forEach(el => {
    const title = removeCdataFromString(el.querySelector('title').textContent)
    const description = removeCdataFromString(
      el.querySelector('description').textContent
    )
    const link = el.querySelector('link').textContent
    const pubDate = getTimestampFromDate(
      el.querySelector('pubDate').textContent
    )

    item = {
      title,
      description,
      link,
      pubDate,
    }
  })

  return item
}

function isUpdated(lastUpdatedAt: number, lastBuildDate: number) {
  return lastUpdatedAt === lastBuildDate
}
