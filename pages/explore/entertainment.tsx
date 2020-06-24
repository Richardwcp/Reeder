import { GetStaticProps } from 'next'
import { getAllEntertainmentPosts } from '@lib/posts'
import Feed from '@components/Feed/feed'
import ExploreTab from '@components/ExploreTab/explore_tab'
import { Post } from '@lib/types/types'

type EntertainmentProps = {
  posts: Post[]
}

export default function EntertainmentProps({ posts }: EntertainmentProps) {
  return (
    <>
      <ExploreTab />
      <Feed posts={posts} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async context => {
  const posts = await getAllEntertainmentPosts()

  return {
    props: {
      posts: posts,
    },
  }
}
