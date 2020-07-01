import { connectToDatabase } from '@utils/mongodb.utils'

async function getAllRssUrls(): Promise<string[]> {
  const db = await connectToDatabase()
  const data = await db.collection('rss_feed').distinct('url')

  return data
}

async function getFeedByUrl(url: string) {
  const db = await connectToDatabase()
  const feed = await db.collection('rss_feed').findOne({ url: url })

  return feed
}

async function updateRssFeed(filter: object, update: object) {
  try {
    const db = await connectToDatabase()
    await db.collection('rss_feed').updateOne(filter, { $set: update })
  } catch (error) {
    console.error(error)
  }
}

export { getAllRssUrls, getFeedByUrl, updateRssFeed }
