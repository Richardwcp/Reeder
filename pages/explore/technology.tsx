import { GetStaticProps } from 'next'
import { getAllTechnologyPosts } from '@lib/posts'
import Feed from '@components/Feed/feed'
import ExploreTab from '@components/ExploreTab/explore_tab'
import { Post } from '@lib/types/types'

type TechnologyProps = {
  posts: Post[]
}

export default function Technology({ posts }: TechnologyProps) {
  return (
    <>
      <ExploreTab />
      <Feed posts={posts} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async context => {
  const posts = await getAllTechnologyPosts()

  return {
    props: {
      posts: posts,
    },
  }
}
