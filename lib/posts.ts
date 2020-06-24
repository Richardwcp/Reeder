import { client, q } from '@utils/fauna-client'
import { Post } from '@lib/types/types'

export async function getAllPosts(): Promise<Post[]> {
  const { data } = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_posts'))),
      q.Lambda('post', q.Get(q.Var('post')))
    )
  )

  return extractPosts(data)
}

export async function getAllTechnologyPosts(): Promise<Post[]> {
  const category: string = 'Technology'

  const data = await getPostsByCategory(category)

  return extractPosts(data)
}

export async function getEntertainmentPosts(): Promise<Post[]> {
  const category: string = 'Entertainment'

  const data = await getPostsByCategory(category)

  return extractPosts(data)
}

async function getPostsByCategory(category: string) {
  const { data } = await client.query(
    q.Map(
      q.Paginate(
        q.Join(
          q.Join(
            q.Match(q.Index('category_by_name'), category),
            q.Index('feed_by_category')
          ),
          q.Index('posts_by_feed')
        )
      ),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )

  return data
}

function extractPosts(data): Post[] {
  return data.map(post => {
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
}
