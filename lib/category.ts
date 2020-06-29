import { client, q } from '@utils/fauna-client.utils'

export async function getAllCategories(): Promise<string[]> {
  const { data } = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_categories'))),
      q.Lambda('category', q.Var('category'))
    )
  )
  return data
}
