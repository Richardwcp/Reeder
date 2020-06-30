import { connectToDatabase } from '@utils/mongodb.utils'

async function getAllRssUrls(): Promise<string[]> {
  const db = await connectToDatabase()
  const data = await db.collection('rss_feed').distinct('url')

  return data
}

async function getFeedIdByUrl(url: string) {
  const db = await connectToDatabase()
  const { _id } = await db.collection('rss_feed').findOne({ url: url })

  return _id
}

export { getAllRssUrls, getFeedIdByUrl }
