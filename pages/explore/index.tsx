import { GetStaticProps } from 'next'
import Link from 'next/link'
import styles from './index.module.scss'
import { getAllPosts } from '../../lib/posts'
import Feed from '../components/Feed/feed'

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
      <Feed posts={posts} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async context => {
  const posts = await getAllPosts()

  return {
    props: {
      posts: posts,
    },
  }
}
