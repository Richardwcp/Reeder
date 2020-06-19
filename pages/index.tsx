import { GetServerSideProps } from 'next'
import jsdom from 'jsdom'
import Header from './components/Header/Header'
import styles from './index.module.scss'

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
      <Header />
      {items.map(({ title, description, link, date }) => {
        return (
          <article className={styles.article}>
            <div className={(styles.example, styles.card)}>
              <div className={styles.wrapper}>
                <div className={styles.date}>
                  <span className={styles.day}>19</span>
                  <span className={styles.month}>June</span>
                  <span className={styles.year}>2020</span>
                </div>
                <div className={styles.data}>
                  <div className={styles.content}>
                    <span className={styles.author}>Jane Doe</span>
                    <h1 className={styles.title}>
                      <a href={link}>{title}</a>
                    </h1>
                    <p className={styles.text}>{description}</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )
      })}
      <style global jsx>{`
        body {
          margin: 0;
          font-family: 'Open Sans';
        }
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const RSS_URL: string = 'http://feeds.skynews.com/feeds/rss/technology.xml'
  const { JSDOM } = jsdom
  const { window } = new JSDOM(``)

  const res = await fetch(RSS_URL)
  const str = await res.text()

  const doc: Document = new window.DOMParser().parseFromString(str, 'text/xml')

  const nodeList = doc.querySelectorAll('item')

  let items = []
  nodeList.forEach((el) => {
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
