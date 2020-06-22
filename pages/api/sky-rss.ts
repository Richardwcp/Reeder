import { NextApiRequest, NextApiResponse } from 'next'
import jsdom from 'jsdom'
import { client, q } from '../utils/fauna-client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { JSDOM } = jsdom
  const { window } = new JSDOM(``)

  const promise = await fetch('http://feeds.skynews.com/feeds/rss/home.xml')
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
  res.status(200).json({ items })
}
