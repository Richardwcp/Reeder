import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './explore_tab.module.scss'

interface Props {}

export default function exploreTab({}: Props) {
  const router = useRouter()
  return (
    <nav className={styles.nav}>
      <ul className={styles.tabList}>
        <li className={router.pathname === '/explore' ? styles.active : ''}>
          <Link href='/explore'>
            <a>Home</a>
          </Link>
        </li>
        <li
          className={
            router.pathname === '/explore/technology' ? styles.active : ''
          }
        >
          <Link href='/explore/technology'>
            <a>Technology</a>
          </Link>
        </li>
        <li
          className={
            router.pathname === '/explore/entertainment' ? styles.active : ''
          }
        >
          <Link href='/explore/entertainment'>
            <a>Entertainment</a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
