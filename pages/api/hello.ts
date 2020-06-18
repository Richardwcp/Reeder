import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const test: string = 'hello'
  const num: number = 2

  res.statusCode = 200
  res.json({ name: 'John Doe' })
}
