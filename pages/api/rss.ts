import { NextApiRequest, NextApiResponse } from 'next'
import jsdom from 'jsdom'
import { removeCdataFromString } from '@utils/sanitise-xml.utils'
import { getAllRssUrls, getFeedByUrl, updateRssFeed } from '@lib/rss_feed'
import { getTimestampFromDate } from '@utils/date.utils'
import { savePostsToDb, findPostByUrl } from '@lib/posts'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const CRON_SECRET = process.env.CRON_SECRET_KEY
  const auth = req.headers.authorization

  if (auth === CRON_SECRET) {
    const rssUrls = await getAllRssUrls()

    const promises = rssUrls.map(async url => {
      const doc: Document = await createDocument(url)
      const { _id: feedId, lastUpdatedAt } = await getFeedByUrl(url)

      const lastBuildDate = getTimestampFromDate(
        doc.querySelector('lastBuildDate').textContent
      )

      const isLatestFeed = lastUpdatedAt === lastBuildDate

      if (!isLatestFeed) {
        const nodeList = doc.querySelectorAll('item')
        const items = extractPostFromNodeList(nodeList)
        const posts = items.map(item => ({ ...item, rss_feed_id: feedId }))

        const filter = { _id: feedId }
        const update = { lastUpdatedAt: lastBuildDate }
        await updateRssFeed(filter, update)

        if (posts.length > 0) {
          return await savePostsToDb(posts)
        }
      }
    })

    try {
      await Promise.all(promises)
      res.status(200).json({
        success: true,
        message: 'Posts saved',
      })
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal server error')
    }
  } else {
    res.status(401).send('401 Unauthorized')
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
  let items = []

  nodeList.forEach(async el => {
    const link = el.querySelector('link').textContent

    const isDuplicate = await isDuplicatePost(link)

    if (isDuplicate) {
      return
    }

    const pubDate = getTimestampFromDate(
      el.querySelector('pubDate').textContent
    )
    const title = removeCdataFromString(el.querySelector('title').textContent)
    const description = removeCdataFromString(
      el.querySelector('description').textContent
    )

    const item = {
      title,
      description,
      link,
      pubDate,
    }

    items.push(item)
  })

  return items
}

async function isDuplicatePost(url: string): Promise<boolean> {
  const post = await findPostByUrl(url)
  return post ? true : false
}
