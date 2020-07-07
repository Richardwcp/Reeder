import { serialize } from 'cookie'

export const setTokenCookie = (res, token) => {
  const oneHour = new Date(Date.now() + 3600 * 1000)

  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: oneHour,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}
