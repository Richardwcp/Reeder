import React from 'react'
import styles from './card.module.scss'

interface Props {
  title: string
  description: string
  link: string
  date: string
}

export default function card({ title, description, link, date }: Props) {
  return (
    <article className={styles.card}>
      {/* <div className={styles.imageContainer}></div> */}
      <div className={styles.content}>
        <div className={styles.abstract}>
          <p className={styles.headline}>
            <a href={link}>{title}</a>
          </p>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.cardBottom}>
          <p className={styles.author}>Jane Doe</p>
        </div>
      </div>
    </article>
  )
}
