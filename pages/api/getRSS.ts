import { NextApiRequest, NextApiResponse } from 'next'
import jsdom from 'jsdom'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { JSDOM } = jsdom
  const { window } = new JSDOM(``)

  const promise = await fetch(
    'http://feeds.skynews.com/feeds/rss/technology.xml'
  )
  const str = await promise.text()

  const doc: Document = new window.DOMParser().parseFromString(str, 'text/xml')
  const nodeList = doc.querySelectorAll('item')

  let items = []
  nodeList.forEach(el => {
    const title = el.querySelector('title').innerHTML
    const description = el.querySelector('description').innerHTML
    const link = el.querySelector('link').innerHTML
    const date = el.querySelector('pubDate').innerHTML

    const item = {
      title,
      description,
      link,
      date,
    }

    items.push(item)
  })

  res.statusCode = 200
  res.json({ items })
}
