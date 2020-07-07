import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@utils/mongodb.utils'
import { hashPassword, createToken, decodeToken } from '@utils/auth.utils'
import { normaliseEmail, normalisePassword, trim } from '@utils/sanitise.utils'
import { setTokenCookie } from '@utils/cookie.utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if ('POST' === req.method) {
    try {
      const db = await connectToDatabase()
      const { email, username, password } = req.body

      const sanitisedUsername = trim(username)
      const sanitisedEmail = normaliseEmail(email)
      const sanitisedPassword = normalisePassword(password)
      const hashedPassword = await hashPassword(sanitisedPassword)

      if (sanitisedPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters',
        })
      }

      let user = await db.collection('user').findOne({
        email: sanitisedEmail,
      })

      if (user) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        })
      }

      user = {
        email: sanitisedEmail,
        username: sanitisedUsername,
        password: hashedPassword,
      }

      const {
        ops: [savedUser],
      } = await db.collection('user').insertOne(user)

      const userInfo = {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      }

      const token = createToken(userInfo)
      const { exp: expiresAt } = decodeToken(token)

      setTokenCookie(res, token)

      return res.status(200).json({
        success: true,
        message: 'User created!',
        userInfo,
        expiresAt,
      })
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          'There was a problem creating the account. Please try again later',
      })
    }
  }
}
