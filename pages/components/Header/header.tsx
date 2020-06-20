import React from 'react'
import styles from './header.module.scss'
import Link from 'next/link'

export default function Header() {
  return (
    <div className={styles.header}>
      <Link href='/'>
        <a>Reeder</a>
      </Link>
    </div>
  )
}
