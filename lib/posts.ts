import { client, q } from '@utils/fauna-client.utils'
import { Post } from '@lib/types/types'
import { connectToDatabase } from '@utils/mongodb.utils'

export async function getAllPosts(): Promise<Post[]> {
  const { data } = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('posts_sort_by_date_desc')), {
        size: 1000,
      }),
      q.Lambda(['date', 'ref'], q.Get(q.Var('ref')))
    )
  )

  return extractPosts(data)
}

export async function getAllTechnologyPosts(): Promise<Post[]> {
  const category: string = 'Technology'

  const data = await getPostsByCategory(category)

  return extractPosts(data)
}

export async function getAllEntertainmentPosts(): Promise<Post[]> {
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
      data: { title, description, link, pubDate },
    } = post
    return {
      title,
      description,
      link,
      pubDate,
    }
  })
}

export async function savePostsToDb(items: Array<any>) {
  try {
    const db = await connectToDatabase()
    await db.collection('posts').insertMany(items)
  } catch (error) {
    console.error(error)
  }
}
