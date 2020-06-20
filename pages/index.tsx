import { GetServerSideProps } from 'next'
import jsdom from 'jsdom'
import Header from './components/Header/header'
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
          <section className={styles.article}>
            <article className={styles.card}>
              <div className={styles.imageContainer}></div>
              <div className={styles.content}>
                <p className={styles.headline}>
                  <a href={link}>{title}</a>
                </p>
                <p className={styles.description}>{description}</p>
              </div>
              <div className={styles.cardBottom}>
                <p className={styles.author}>Jane Doe</p>
              </div>
            </article>
          </section>
        )
      })}
    </>
  )
}

export async function getStaticProps(context) {
  const res = await fetch('http://localhost:3000/api/getRSS') //add localhost to env variable
  const items = await res.json()

  return {
    props: items,
  }
}
