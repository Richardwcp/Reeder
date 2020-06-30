import { client, q } from '@utils/fauna-client.utils'
import { Post } from '@lib/types/types'
import { connectToDatabase } from '@utils/mongodb.utils'

export async function getAllPosts(): Promise<Post[]> {
  const db = await connectToDatabase()

  const posts = await db
    .collection('posts')
    .find({})
    .project({ rss_feed: false })
    .toArray()

  return extractPosts(posts)
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
    const { _id: id } = post
    console.log(id.toString())
    return { _id: JSON.stringify(id), ...post }
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
