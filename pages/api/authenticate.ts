import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@utils/mongodb.utils'
import { createToken, decodeToken, verifyPassword } from '@utils/auth.utils'
import { serialize } from 'cookie'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if ('POST' === req.method) {
    try {
      const db = await connectToDatabase()
      const { email, password } = req.body

      const user = await db.collection('user').findOne({ email: email })

      if (!user) {
        return res
          .status(403)
          .json({ success: false, message: 'Incorrect email or password' })
      }

      const passwordValid = verifyPassword(password, user.password)

      if (!passwordValid) {
        return res
          .status(403)
          .json({ success: false, message: 'Incorrect email or password' })
      }

      const token = createToken(user)
      const { exp: expiresAt } = decodeToken(token)

      const userInfo = {
        username: user.username,
        email: user.email,
      }

      res.setHeader(
        'set-cookie',
        serialize('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: true,
        })
      )
      return res.status(200).json({
        success: true,
        message: 'Authentication successful!',
        userInfo,
        expiresAt,
      })
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Something went wrong',
      })
    }
  }
}
