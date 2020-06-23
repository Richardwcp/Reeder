import React from 'react'
import styles from './feed.module.scss'
import Card from '../Card/card'

type Post = {
  title: string
  description: string
  link: string
  date: string
}

interface Props {
  posts: Post[]
}

export default function feed({ posts }: Props) {
  return (
    <section className={styles.section}>
      {posts.map(({ title, description, link, date }) => {
        return (
          <Card
            title={title}
            description={description}
            link={link}
            date={date}
          />
        )
      })}
    </section>
  )
}
