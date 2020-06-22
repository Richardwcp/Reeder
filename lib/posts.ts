import { client, q } from '../utils/fauna-client'

export async function getAllPosts() {
  const { data } = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_posts'))),
      q.Lambda('post', q.Get(q.Var('post')))
    )
  )

  const posts = data.map(post => {
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

  return posts
}