import { Post } from '@lib/types/types'
import { connectToDatabase } from '@utils/mongodb.utils'

export async function getAllPosts(): Promise<Post[]> {
  const db = await connectToDatabase()

  const posts = await db
    .collection('posts')
    .find({})
    .sort({ pubDate: -1 })
    .toArray()

  return convertObjectIdToString(posts)
}

export async function getAllTechnologyPosts(): Promise<Post[]> {
  const category: string = 'Technology'

  const posts = await getPostsByCategory(category)

  return convertObjectIdToString(posts)
}

export async function getAllEntertainmentPosts(): Promise<Post[]> {
  const category: string = 'Entertainment'

  const posts = await getPostsByCategory(category)

  return convertObjectIdToString(posts)
}

async function getPostsByCategory(category: string) {
  const db = await connectToDatabase()
  return await db
    .collection('posts')
    .aggregate([
      {
        $lookup: {
          from: 'rss_feed',
          localField: 'rss_feed_id',
          foreignField: '_id',
          as: 'rss',
        },
      },
      {
        $lookup: {
          from: 'category',
          localField: 'rss.category_id',
          foreignField: '_id',
          as: 'cat',
        },
      },
      { $match: { 'cat.name': category } },
      { $sort: { pubDate: -1 } },
    ])
    .project({
      rss: false,
      cat: false,
    })
    .toArray()
}

function convertObjectIdToString(data): Post[] {
  return data.map(post => {
    const { _id, rss_feed_id } = post
    return {
      ...post,
      _id: JSON.stringify(_id),
      rss_feed_id: JSON.stringify(rss_feed_id),
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
