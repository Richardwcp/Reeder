import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import { createToken, decodeToken, verifyPassword } from '@utils/auth.utils'
import { normaliseEmail } from '@utils/sanitise.utils'
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
      const { email, password } = req.body
      const sanitisedEmail = normaliseEmail(email)

      const user = await req.db
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

      const userInfo = {
        id: user._id,
        username: user.username,
        email: user.email,
      }

      const token = createToken(userInfo)
      const { exp: expiresAt } = decodeToken(token)

      setTokenCookie(res, token)

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
)
