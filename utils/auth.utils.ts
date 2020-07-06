import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nextCookie from 'next-cookies'

export const auth = (context): string | undefined => {
  const { token } = nextCookie(context)
  if (context.req && !token) {
    context.res.writeHead(302, { Location: '/login' })
    context.res.end()
    return
  }

  return token
}

export const verifyPassword = (
  attemptedPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(attemptedPassword, hashedPassword)
}

export const hashPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync(12)
  const hash = await bcrypt.hash(password, salt)

  return hash
}

export const createToken = userObj => {
  const { _id: id, email } = userObj
  return jwt.sign(
    {
      sub: id,
      email: email,
      iss: 'api.reeder',
      aud: 'api.reeder',
    },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '1h' }
  )
}

export const decodeToken = token => {
  const decodedToken = jwt.decode(token)
  return decodedToken
}

export const verifyToken = token => {
  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
  return verifiedToken
}
