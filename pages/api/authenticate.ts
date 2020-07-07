import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@utils/mongodb.utils'
import { createToken, decodeToken, verifyPassword } from '@utils/auth.utils'
import { serialize } from 'cookie'
import { normaliseEmail } from '@utils/sanitise.utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if ('POST' === req.method) {
    try {
      const db = await connectToDatabase()
      const { email, password } = req.body
      const secure = process.env.NODE_ENV !== 'development'

      const sanitisedEmail = normaliseEmail(email)

      const user = await db
        .collection('user')
        .findOne({ email: sanitisedEmail })

      if (!user) {
        return res
          .status(403)
          .json({ success: false, message: 'Incorrect email or password' })
      }

      const passwordValid = await verifyPassword(password, user.password)

      if (!passwordValid) {
        return res
          .status(403)
          .json({ success: false, message: 'Incorrect email or password' })
      }

      const token = createToken(user)
      const { exp: expiresAt } = decodeToken(token)

      const userInfo = {
        id: user._id,
        username: user.username,
        email: user.email,
      }

      res.setHeader(
        'Set-Cookie',
        serialize('token', token, {
          httpOnly: true,
          sameSite: true,
          secure: secure,
          path: '/',
          expires: new Date(Date.now() + 3600 * 1000),
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
