import React from 'react'
import Link from 'next/link'

interface Props {}

export default function exploreTab({}: Props) {
  return (
    <nav style={{ width: '100%' }}>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'row',
          listStyle: 'none',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <li>
          <Link href='/explore'>
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href='/explore/technology'>
            <a>Technology</a>
          </Link>
        </li>
        <li>
          <Link href='/explore/entertainment'>
            <a>Entertainment</a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
