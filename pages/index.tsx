import { GetServerSideProps } from 'next'
import jsdom from 'jsdom'

type Item = {
  title: string
  description: string
  link: string
  date: string
}

type HomeProps = {
  items: Item[]
}

export default function Home({ items }: HomeProps) {
  return (
    <>
      {items.map(({ title, description, link, date }) => {
        return (
          <article>
            <h2>
              <a href={link} target='_blank' rel='noopener'>
                {title}
              </a>
              {description}
            </h2>
          </article>
        )
      })}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const RSS_URL: string = 'http://feeds.skynews.com/feeds/rss/technology.xml'
  const { JSDOM } = jsdom
  const { window } = new JSDOM(``)

  const res = await fetch(RSS_URL)
  const str = await res.text()

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

  return {
    props: {
      items,
    },
  }
}
