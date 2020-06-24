import { GetStaticProps } from 'next'
import { getAllPosts } from '@lib/posts'
import Feed from '@components/Feed/feed'
import ExploreTab from '@components/ExploreTab/explore_tab'
import { Post } from '@lib/types/types'

type HomeProps = {
  posts: Post[]
}

export default function Home({ posts }: HomeProps) {
  return (
    <>
      <ExploreTab />
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
