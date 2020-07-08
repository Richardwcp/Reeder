import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import { hashPassword, createToken, decodeToken } from '@utils/auth.utils'
import { normaliseEmail, normalisePassword, trim } from '@utils/sanitise.utils'
import { setTokenCookie } from '@utils/cookie.utils'
import database from '@middleware/database'
import { Db } from 'mongodb'

const handler = nextConnect()
handler.use(database)

interface CustomApiRequest extends NextApiRequest {
  db: Db
}

export default handler.post(
  async (req: CustomApiRequest, res: NextApiResponse) => {
    try {
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

      let user = await req.db.collection('user').findOne({
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
      } = await req.db.collection('user').insertOne(user)

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
)
