import { GetStaticProps } from 'next'
import Header from './components/Header/header'
import styles from './index.module.scss'
import { client, q } from './utils/fauna-client'

type Post = {
  title: string
  description: string
  link: string
  date: string
}

type HomeProps = {
  posts: Post[]
}

export default function Home({ posts }: HomeProps) {
  return (
    <>
      <Header />
      <section className={styles.section}>
        {posts.map(({ title, description, link, date }) => {
          return (
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
          )
        })}
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async context => {
  const { data } = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_posts'))),
      q.Lambda('post', q.Get(q.Var('post')))
    )
  )

  const posts = data.map(post => {
    const {
      data: { title, description, link, date },
    } = post
    return {
      title,
      description,
      link,
      date,
    }
  })

  return {
    props: {
      posts,
    },
  }
}
