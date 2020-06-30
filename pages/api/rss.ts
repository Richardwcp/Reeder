import { NextApiRequest, NextApiResponse } from 'next'
import jsdom from 'jsdom'
import { removeCdataFromString } from '@utils/sanitise-xml.utils'
import { getAllRssUrls, getFeedIdByUrl } from '@lib/rss_feed'
import { getTimestampFromDate } from '@utils/date.utils'
import { savePostsToDb } from '@lib/posts'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const rssUrls = await getAllRssUrls()

  const promises = rssUrls.map(async url => {
    const items = await extractRssContent(url)
    return await savePostsToDb(items)
  })

  try {
    await Promise.all(promises)
    res.status(200).send('Saved')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
}

async function extractRssContent(url: string) {
  const { JSDOM } = jsdom
  const { window } = new JSDOM(``)

  const feedId = await getFeedIdByUrl(url)
  const promise = await fetch(url)
  const str = await promise.text()

  const doc: Document = new window.DOMParser().parseFromString(str, 'text/xml')
  const nodeList = doc.querySelectorAll('item')

  let items = []
  nodeList.forEach(el => {
    const title = removeCdataFromString(el.querySelector('title').innerHTML)
    const description = removeCdataFromString(
      el.querySelector('description').innerHTML
    )
    const link = el.querySelector('link').innerHTML
    const pubDate = getTimestampFromDate(el.querySelector('pubDate').innerHTML)

    const item = {
      title,
      description,
      link,
      pubDate,
      rss_feed: feedId,
    }

    items.push(item)
  })

  return items
}
