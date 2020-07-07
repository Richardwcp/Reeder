import nextConnect from 'next-connect'
import { verifyToken } from '@utils/auth.utils'
import { getTokenFromCookie } from '@utils/cookie.utils'

function authorise(req, res, next) {
  try {
    const token = getTokenFromCookie(req)
    const decodedToken = verifyToken(token)
    req.user = decodedToken

    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Not authorised' })
  }
}

const middleware = nextConnect()

middleware.use(authorise)

export default middleware
