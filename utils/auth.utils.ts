import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cookies from 'next-cookies'

const auth = context => {
  const { token } = cookies(context)
  try {
    const decoded = decodeToken(token)
  } catch (err) {
    console.error(err)
  }
}
const decodeToken = token => {
  const decodedToken = jwt.decode(token)
  return decodedToken
}

const verifyToken = token => {
  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
  return verifiedToken
}

const hashPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync(12)
  const hash = await bcrypt.hash(password, salt)

  return hash
}

const createToken = userObj => {
  console.log(userObj)
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

export { hashPassword, createToken, decodeToken }
