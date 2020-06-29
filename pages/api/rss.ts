import { NextApiRequest, NextApiResponse } from 'next'
import jsdom from 'jsdom'
import { client, q } from '@utils/fauna-client.utils'
import { removeCdataFromString } from '@utils/sanitise-xml.utils'
import { getAllRssUrls, getFeedByUrl } from '@lib/rss_feed'
import { getTimestampFromDate } from '@utils/date.utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const rssUrls = await getAllRssUrls()

  const promises = rssUrls.map(async url => {
    const items = await extractRssContent(url)
    return await saveToDb(items)
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

  const feedRef = await getFeedByUrl(url)
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
      rss_feed: feedRef,
    }

    items.push(item)
  })

  return items
}

//ToDo: Need to move to lib dir
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
