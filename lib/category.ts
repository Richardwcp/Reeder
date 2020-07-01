import { connectToDatabase } from '@utils/mongodb.utils'

interface Category {
  _id: string
  name: string
}

export async function getAllCategories(): Promise<Category[]> {
  const db = await connectToDatabase()

  const categories = await db.collection('category').distinct('name')

  return categories
}
