import faunadb, { Client, query as q } from 'faunadb'

const secret = process.env.FAUNADB_SECRET_KEY
const client: Client = new faunadb.Client({ secret })

export { client, q }
